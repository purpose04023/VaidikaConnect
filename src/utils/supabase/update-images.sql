-- SQL Update script to sync Deity image paths with the new premium generated assets
-- Copy and execute these commands inside your Supabase SQL Editor.

-- Update Ganesha Image
UPDATE public.stotrams 
SET image_url = '/images/deities/ganesha.png' 
WHERE deity_name = 'Ganesha' OR id = '00000000-0000-0000-0000-00000ganesha';

-- Update Shiva Image
UPDATE public.stotrams 
SET image_url = '/images/deities/shiva.png' 
WHERE deity_name = 'Shiva' OR id = '00000000-0000-0000-0000-0000000shiva';

-- Update Vishnu Image
UPDATE public.stotrams 
SET image_url = '/images/deities/vishnu.png' 
WHERE deity_name = 'Vishnu' OR id = '00000000-0000-0000-0000-000000vishnu';

-- Update Rama Image
UPDATE public.stotrams 
SET image_url = '/images/deities/rama.png' 
WHERE deity_name = 'Rama' OR id = '00000000-0000-0000-0000-00000000rama';

-- Update Hanuman Image
UPDATE public.stotrams 
SET image_url = '/images/deities/hanuman.png' 
WHERE deity_name = 'Hanuman' OR id = '00000000-0000-0000-0000-000hanuman';

-- Update Lalitha Image
UPDATE public.stotrams 
SET image_url = '/images/deities/lalitha.png' 
WHERE deity_name = 'Lalitha' OR id = '00000000-0000-0000-0000-0000lalitha';

-- Update Lakshmi Image
UPDATE public.stotrams 
SET image_url = '/images/deities/lakshmi.png' 
WHERE deity_name = 'Lakshmi' OR id = '00000000-0000-0000-0000-0000lakshmi';

-- Update Saraswati Image
UPDATE public.stotrams 
SET image_url = '/images/deities/saraswati.png' 
WHERE deity_name = 'Saraswati' OR id = '00000000-0000-0000-0000-0saraswati';

-- Update Durga Image
UPDATE public.stotrams 
SET image_url = '/images/deities/durga.png' 
WHERE deity_name = 'Durga' OR id = '00000000-0000-0000-0000-0000000durga';
