DELETE FROM public.influencer_posts
WHERE NOT (
  (
    lower(coalesce(text,'') || ' ' || array_to_string(coalesce(hashtags,'{}'), ' ')) LIKE '%#peloticadegoma%'
    AND (
      lower(coalesce(text,'') || ' ' || array_to_string(coalesce(hashtags,'{}'), ' ')) LIKE '%#amoajuga%'
      OR lower(coalesce(text,'') || ' ' || array_to_string(coalesce(hashtags,'{}'), ' ')) LIKE '%#vamoajuga%'
    )
  )
  OR lower(coalesce(text,'')) ~ '@(diablosdelabastidas|bombillosdepetare|vikingosdecharallave|torosdelavega|losperrosdelosguayos|losvipdepintoo|coquitoysucombopdg|losrelampagoskk|peloticadegomave|mabastidas|luis_sojo19|gesaria|luchomosqueda|azuaje\.230|lamentedepinto|coquitooriginal|diazkarate|jhonsnacks|juansofa)'
);