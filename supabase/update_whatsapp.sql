-- تحديث أرقام الواتساب الصحيحة للمتاجر (شغّليها مرة وحدة بمحرر SQL بلوحة Supabase)
update stores
set whatsapp = '972569719591'
where id = 'lamset-sabaya';

update stores
set whatsapp = '970599979155'
where id in ('lamset-jamal', 'maaraz-lamset-jamal');
