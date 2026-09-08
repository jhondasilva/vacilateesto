DELETE FROM public.influencer_posts
WHERE lower(coalesce(text,'') || ' ' || array_to_string(coalesce(hashtags,'{}'), ' ')) !~ '#(peloticadegoma|amoajuga|vamoajuga)';