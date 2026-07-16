-- تحديث عنوان ودوام المتاجر الثلاثة (شغّليها مرة وحدة بمحرر SQL بلوحة Supabase)
update stores
set address = 'الشارع الرئيسي - دخلة الصحة القديمة',
    hours = 'يومياً: 9:00ص - 11:00م',
    translations = jsonb_set(translations, '{en,hours}', '"Daily: 9:00 AM - 11:00 PM"')
where id in ('lamset-jamal', 'lamset-sabaya', 'maaraz-lamset-jamal');

update stores
set translations = jsonb_set(translations, '{he,hours}', '"כל יום: 09:00-23:00"')
where id in ('lamset-jamal', 'lamset-sabaya', 'maaraz-lamset-jamal');
