-- إضافة روابط فيسبوك وانستجرام لكل متجر (شغّليها مرة وحدة بمحرر SQL بلوحة Supabase)
alter table stores add column if not exists facebook text;
alter table stores add column if not exists instagram text;

update stores
set facebook = 'https://www.facebook.com/share/1B7dhezfv3/?mibextid=wwXIfr',
    instagram = 'https://www.instagram.com/beauty.touch017?igsh=MTBqcWU0djV6emN6Yg=='
where id = 'lamset-jamal';

update stores
set facebook = 'https://www.facebook.com/share/1HtGN2WgmD/?mibextid=wwXIfr',
    instagram = 'https://www.instagram.com/lamset.sabaya?igsh=MTRscWNsdmRueDB2MQ=='
where id = 'lamset-sabaya';

update stores
set facebook = 'https://www.facebook.com/share/1B7dhezfv3/?mibextid=wwXIfr',
    instagram = 'https://www.instagram.com/beauty.touch017?igsh=MTBqcWU0djV6emN6Yg=='
where id = 'maaraz-lamset-jamal';
