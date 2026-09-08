-- Insertar/actualizar post de super chivo @juansofa encontrado por Apify
INSERT INTO public.influencer_posts (
  campaign_slug, category, platform, external_id, author_handle, author_name,
  author_followers, url, text, thumbnail, published_at, views, likes, comments,
  shares, hashtags, synced_at
) VALUES (
  'pelotica-de-goma', 'super-chivo', 'instagram', '3979869418769536554', '@juansofa',
  'Juan carlos Martinez', NULL, 'https://www.instagram.com/p/Dc7ViZuMtYq/',
  '3 AÑOS Y 7 MESES DESPUÉS, @peloticadegomave ya no es un sueño es un proyecto de vida que nos ha enseñado tanto!! Aqui vamos de nuevo!! gracias a mis queridos chivos @luchomosqueda @coquitooriginal @gesaria @mabastidas @azuaje.230 @diazkarate @lamentedepinto @luis_sojo19 por seguir apostando por tan bonito proyecto! A todo el equipo de @elpatiocontentstudio son unos grandes!!! Hermano @jhonsnacks 1 mas!! #amoajuga',
  'https://scontent-dus1-1.cdninstagram.com/v/t51.71878-15/797842027_1744878776752968_6146202234748838872_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=100&ig_cache_key=Mzk3OTg2OTQxODc2OTUzNjU1NDQzMDEwNzAxNjM0Nzk3Mjc%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5zZHIudmlkZW9fbmZyYW1lX2NvdmVyX2ZyYW1lLkMzIn0%3D&_nc_ohc=CfD6fgNzwV8Q7kNvwGpq14M&_nc_oc=AdoU_dfcmjbOBBCdmLByRvMLhFCJkfj9SeTbgxH0QzO6jfWCaBi9XJh1E5zOvbtDe9U&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-dus1-1.cdninstagram.com&_nc_gid=8KSqjlL3UfjYRAvqwmzU2Q&_nc_ss=7a22e&oh=00_AQKzDBqbi_SqKBLyMjpAsIiWX6Sp47FTiT69Lc4URuBPlA&oe=6AA64452',
  '2026-09-06T01:22:29.000Z', 826, 137, 22, 0, '{#amoajuga}', now()
)
ON CONFLICT (campaign_slug, platform, external_id) DO UPDATE SET
  category = EXCLUDED.category,
  author_handle = EXCLUDED.author_handle,
  author_name = EXCLUDED.author_name,
  author_followers = EXCLUDED.author_followers,
  url = EXCLUDED.url,
  text = EXCLUDED.text,
  thumbnail = EXCLUDED.thumbnail,
  published_at = EXCLUDED.published_at,
  views = EXCLUDED.views,
  likes = EXCLUDED.likes,
  comments = EXCLUDED.comments,
  shares = EXCLUDED.shares,
  hashtags = EXCLUDED.hashtags,
  synced_at = EXCLUDED.synced_at;

-- Mover posts de @jhonsnacks y @juansofa desde 'oficial' a 'super-chivo'
UPDATE public.influencer_posts
SET category = 'super-chivo'
WHERE campaign_slug = 'pelotica-de-goma'
  AND category = 'oficial'
  AND lower(author_handle) IN ('@jhonsnacks', '@juansofa');

-- Eliminar super-chivos que no tengan #amoajuga o #peloticadegoma
DELETE FROM public.influencer_posts
WHERE campaign_slug = 'pelotica-de-goma'
  AND category = 'super-chivo'
  AND lower(author_handle) IN ('@jhonsnacks', '@juansofa')
  AND NOT (
    lower(coalesce(text, '')) ~ '#amoajuga|#peloticadegoma'
    OR lower(array_to_string(coalesce(hashtags, ARRAY[]::text[]), ' ')) ~ '#amoajuga|#peloticadegoma'
  );

-- Eliminar posts de @vacilateesto/@vacilateestopodcast en 'oficial' que no tengan #amoajuga o #peloticadegoma
DELETE FROM public.influencer_posts
WHERE campaign_slug = 'pelotica-de-goma'
  AND category = 'oficial'
  AND lower(author_handle) IN ('@vacilateesto', '@vacilateestopodcast')
  AND NOT (
    lower(coalesce(text, '')) ~ '#amoajuga|#peloticadegoma'
    OR lower(array_to_string(coalesce(hashtags, ARRAY[]::text[]), ' ')) ~ '#amoajuga|#peloticadegoma'
  );