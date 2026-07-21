-- تصحيح عنوان المتاجر الثلاثة لقلقيلية (شغّليها مرة وحدة بمحرر SQL بلوحة Supabase)
update stores
set address = 'قلقيلية - الشارع الرئيسي - دخلة الصحة القديمة',
    translations = jsonb_set(
      jsonb_set(translations, '{en,address}', '"Qalqilya - Main Street, Old Health Alley"'),
      '{he,address}', '"קלקיליה - הרחוב הראשי - סמטת הבריאות הישנה"'
    )
where id in ('lamset-jamal', 'lamset-sabaya', 'maaraz-lamset-jamal');
