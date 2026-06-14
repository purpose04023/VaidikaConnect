-- SQL Update script to sync Deity image paths with the new premium generated assets
-- Copy and execute these commands inside your Supabase SQL Editor.

-- Update Ganesha Image
UPDATE public.stotrams 
SET image_url = '/images/deities/ganesha.png' 
WHERE deity_name = 'Ganesha';

-- Update Shiva Image
UPDATE public.stotrams 
SET image_url = '/images/deities/shiva.png' 
WHERE deity_name = 'Shiva';

-- Update Vishnu Image
UPDATE public.stotrams 
SET image_url = '/images/deities/vishnu.png' 
WHERE deity_name = 'Vishnu';

-- Update Rama Image
UPDATE public.stotrams 
SET image_url = '/images/deities/rama.png' 
WHERE deity_name = 'Rama';

-- Update Hanuman Image
UPDATE public.stotrams 
SET image_url = '/images/deities/hanuman.png' 
WHERE deity_name = 'Hanuman';

-- Update Lalitha Image
UPDATE public.stotrams 
SET image_url = '/images/deities/lalitha.png' 
WHERE deity_name = 'Lalitha';

-- Update Lakshmi Image
UPDATE public.stotrams 
SET image_url = '/images/deities/lakshmi.png' 
WHERE deity_name = 'Lakshmi';

-- Update Saraswati Image
UPDATE public.stotrams 
SET image_url = '/images/deities/saraswati.png' 
WHERE deity_name = 'Saraswati';

-- Update Durga Image
UPDATE public.stotrams 
SET image_url = '/images/deities/durga.png' 
WHERE deity_name = 'Durga';
