"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Loader2, MessageCircle, Send, ShieldCheck, Trash2, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ManagedImage } from "@/components/common/ManagedImage";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/use-auth";
import { isAdminEmail } from "@/lib/admin";
import { compressImage } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { uploadAsset } from "@/utils/supabase/storage";

type ProfileSummary = {
  full_name: string | null;
  role: "user" | "poojari" | "admin" | null;
  photo: string | null;
};

type AalayaComment = {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
  profiles?: ProfileSummary | null;
};

type AalayaPost = {
  id: string;
  author_id: string;
  caption: string;
  image_url: string;
  created_at: string;
  profiles?: ProfileSummary | null;
  aalaya_comments?: AalayaComment[];
  aalaya_likes?: { user_id: string }[];
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function imageExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension && /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
}

export default function AalayaSannidiPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  const [posts, setPosts] = useState<AalayaPost[]>([]);
  const [profile, setProfile] = useState<ProfileSummary | null>(null);
  const [caption, setCaption] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const isPublisher = profile?.role === "poojari" || profile?.role === "admin" || isAdminEmail(user?.email);

  const loadFeed = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("aalaya_posts")
      .select(`
        id,
        author_id,
        caption,
        image_url,
        created_at,
        profiles:author_id(full_name, role, photo),
        aalaya_comments(id, body, created_at, user_id, profiles:user_id(full_name, photo, role)),
        aalaya_likes(user_id)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "AalayaSannidi feed unavailable",
        description: error.message,
      });
    } else {
      setPosts((data || []) as AalayaPost[]);
    }
    setIsLoading(false);
  }, [supabase, toast]);

  useEffect(() => {
    void loadFeed();
  }, [loadFeed]);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role, photo")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setProfile({
          full_name: user.email || "Devotee",
          role: isAdminEmail(user.email) ? "admin" : "user",
          photo: null,
        });
        return;
      }

      setProfile({
        full_name: data?.full_name || user.email || "Devotee",
        role: (isAdminEmail(user.email) ? "admin" : data?.role || "user") as ProfileSummary["role"],
        photo: data?.photo || null,
      });
    }

    void loadProfile();
  }, [supabase, user]);

  const createPost = async () => {
    if (!user || !isPublisher) return;
    if (!photo) {
      toast({
        variant: "destructive",
        title: "Photo required",
        description: "AalayaSannidi posts must include a photo.",
      });
      return;
    }

    setIsPosting(true);
    try {
      const compressed = await compressImage(photo, 1200, 0.82);
      const publicUrl = await uploadAsset(
        `aalaya-sannidi/${user.id}-${Date.now()}.${imageExtension(photo)}`,
        compressed
      );

      const { error } = await supabase.from("aalaya_posts").insert({
        author_id: user.id,
        caption: caption.trim(),
        image_url: publicUrl,
      });

      if (error) throw error;

      setCaption("");
      setPhoto(null);
      toast({ title: "Post shared", description: "Your AalayaSannidi photo is now live." });
      await loadFeed();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Post failed",
        description: error instanceof Error ? error.message : "Unable to share this post.",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = async (post: AalayaPost) => {
    if (!user) return;
    setActiveAction(`like-${post.id}`);
    try {
      const hasLiked = post.aalaya_likes?.some((like) => like.user_id === user.id);
      const result = hasLiked
        ? await supabase.from("aalaya_likes").delete().eq("post_id", post.id).eq("user_id", user.id)
        : await supabase.from("aalaya_likes").insert({ post_id: post.id, user_id: user.id });

      if (result.error) throw result.error;
      await loadFeed();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Like failed",
        description: error instanceof Error ? error.message : "Unable to update like.",
      });
    } finally {
      setActiveAction(null);
    }
  };

  const addComment = async (postId: string) => {
    if (!user) return;
    const body = comments[postId]?.trim();
    if (!body) return;

    setActiveAction(`comment-${postId}`);
    try {
      const { error } = await supabase.from("aalaya_comments").insert({
        post_id: postId,
        user_id: user.id,
        body,
      });

      if (error) throw error;
      setComments((current) => ({ ...current, [postId]: "" }));
      await loadFeed();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Comment failed",
        description: error instanceof Error ? error.message : "Unable to add this comment.",
      });
    } finally {
      setActiveAction(null);
    }
  };

  const deletePost = async (postId: string) => {
    if (!user) return;
    const confirmed = window.confirm("Delete this AalayaSannidi post?");
    if (!confirmed) return;

    setActiveAction(`delete-${postId}`);
    try {
      const { error } = await supabase.from("aalaya_posts").delete().eq("id", postId);
      if (error) throw error;
      toast({ title: "Post deleted", description: "The post has been removed from AalayaSannidi." });
      await loadFeed();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Unable to delete this post.",
      });
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <main className="min-h-screen bg-background pt-36">
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto flex flex-col gap-4 px-4 py-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-3 gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Poojari community
            </Badge>
            <h1 className="font-headline text-4xl text-primary md:text-5xl">AalayaSannidi</h1>
            <p className="mt-3 text-muted-foreground">
              Sacred moments shared by verified poojaris and admins. Devotees can view, like, and comment after signing in.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Public feed, protected posting
          </div>
        </div>
      </section>

      <div className="container mx-auto grid gap-6 px-4 py-8 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-4">
          {isUserLoading ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">Checking account access...</CardContent>
            </Card>
          ) : isPublisher ? (
            <Card className="sticky top-36">
              <CardHeader>
                <CardTitle>Share a sacred photo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input type="file" accept="image/*" onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
                <Textarea
                  rows={4}
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder="Add a blessing, story, temple moment, or ritual note..."
                />
                <Button className="w-full" onClick={createPost} disabled={isPosting}>
                  {isPosting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Publish Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Posting Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Only verified poojaris and admins can create AalayaSannidi posts.</p>
                {!user && (
                  <Button asChild>
                    <Link href="/login">Login to like and comment</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </aside>

        <section className="space-y-5">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center gap-2 p-6 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading AalayaSannidi...
              </CardContent>
            </Card>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No posts yet. The first sacred moment will appear here.
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => {
              const author = post.profiles;
              const hasLiked = post.aalaya_likes?.some((like) => like.user_id === user?.id);
              const canManage = profile?.role === "admin" || post.author_id === user?.id;
              return (
                <Card key={post.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">{author?.full_name || "VaidikaConnect Poojari"}</CardTitle>
                      <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {author?.role && <Badge variant="outline">{author.role}</Badge>}
                      {canManage && (
                        <Button variant="ghost" size="icon" onClick={() => deletePost(post.id)} disabled={activeAction === `delete-${post.id}`}>
                          {activeAction === `delete-${post.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ManagedImage
                      src={post.image_url}
                      alt={post.caption || "AalayaSannidi post"}
                      width={1200}
                      height={800}
                      className="max-h-[620px] w-full rounded-md object-cover"
                    />
                    {post.caption && <p className="whitespace-pre-line text-sm leading-6">{post.caption}</p>}
                    <div className="flex flex-wrap items-center gap-3 border-y border-border py-3">
                      {user ? (
                        <Button variant={hasLiked ? "default" : "outline"} size="sm" onClick={() => toggleLike(post)} disabled={activeAction === `like-${post.id}`}>
                          {activeAction === `like-${post.id}` ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Heart className="mr-2 h-4 w-4" />}
                          {post.aalaya_likes?.length || 0}
                        </Button>
                      ) : (
                        <Button asChild variant="outline" size="sm">
                          <Link href="/login">
                            <Heart className="mr-2 h-4 w-4" />
                            {post.aalaya_likes?.length || 0}
                          </Link>
                        </Button>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4" />
                        {post.aalaya_comments?.length || 0} comments
                      </div>
                    </div>
                    <div className="space-y-3">
                      {(post.aalaya_comments || []).map((comment) => (
                        <div key={comment.id} className="rounded-md bg-muted/60 p-3">
                          <div className="mb-1 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{comment.profiles?.full_name || "Devotee"}</span>
                            <span>{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="text-sm">{comment.body}</p>
                        </div>
                      ))}
                      {user ? (
                        <div className="flex gap-2">
                          <Input
                            value={comments[post.id] || ""}
                            onChange={(event) => setComments((current) => ({ ...current, [post.id]: event.target.value }))}
                            placeholder="Write a respectful comment..."
                          />
                          <Button size="icon" onClick={() => addComment(post.id)} disabled={activeAction === `comment-${post.id}`}>
                            {activeAction === `comment-${post.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                          </Button>
                        </div>
                      ) : (
                        <Button asChild variant="outline" size="sm">
                          <Link href="/login">Login to comment</Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
