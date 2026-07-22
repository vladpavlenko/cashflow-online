# Player Progression Schema v2 (спрощена)

```
playerProfile = {
  education: Set<EducationID>,
  courses: Set<CourseID>,
  trainings: Set<TrainingID>,
  licenses: Set<LicenseID>,
  experience: Set<ExperienceID>,
  personal: {
    gender: 'M' | 'F',
    has_partner: boolean,
    children: number,        // 0..3
    can_have_relationship: boolean
  },
  inventory: Set<ItemID>
}
```

Логіка залежностей у вимогах карток (jobs_employee/self, стартапи тощо)
будується поверх `courses`/`education`/`licenses` за трьома формами:
- один конкретний ID
- декілька ID одночасно (`allOf`)
- один із кількох ID (`anyOf`)

---

## 1. EDUCATION (12 значень: 5 вищих/неповних + 7 технічних)

| ID | Назва |
|---|---|
| `higher_medical` | Вища медична освіта |
| `higher_medical_incomplete` | Незакінчена вища медична освіта |
| `higher_legal` | Вища юридична освіта |
| `higher_humanitarian` | Вища гуманітарна освіта |
| `higher_economic` | Вища економічна освіта |
| `technical_mechanic` | Середня освіта: автотехнік |
| `technical_cooking` | Середня освіта: повар |
| `technical_plumbing` | Середня освіта: сантехнік |
| `technical_carpenter` | Середня освіта: столяр |
| `technical_electrician` | Середня освіта: електрик |
| `technical_medical` | Середня освіта: медсестра |
| `technical_sewing` | Середня освіта: швея |

---

## 2. COURSES (62 значення — повний список id з cards_data.js)

Групування нижче — орієнтовне, для власної зручності читання; в даних
курси зберігаються плоским списком без цих груп (число в дужках —
фактична кількість id в групі).

**IT / ПК (15):**
`pc_confident`, `prog_cpp`, `prog_php`, `prog_csharp`, `prog_java`,
`prog_js_frameworks`, `prog_python`, `html_css`,
`web_design_beginners`, `own_site_24h`, `3d_max`, `video_editing`,
`polygraphy`, `contextual_ads_setup`, `seo`

**Краса (15):**
`visage`, `lash_extension`, `waxing`, `hair_colorist`,
`manicure_pedicure`, `permanent_makeup_full`, `hair_extension_capsule`,
`stylist_courses`, `hairdresser_basic`, `laser_hair_removal`,
`face_cleaning_device`, `barber_professional`, `sugaring_epilation`,
`mesotherapy`, `basic_cosmetology`

**Танці (3):** `dance_gogo`, `dance_twerk`, `pole_dance`

**Масаж (2):** `sport_massage`, `anticellulite_massage`

**Медицина/стоматологія (10):**
`plastic_surgery_usa`, `plastic_surgery_austria`, `mammoplasty_israel`,
`dental_tech`, `dental_implants`, `periodontology`,
`dental_technologies_modern`, `bracket_systems`,
`doctor_qualification_upgrade`, `dietolog`

**Фітнес (2):** `crossfit_trainer`, `fitness_trainer`

**Бар/сервіс (4):**
`bartender_basic`, `bartender_flairing`, `waiter_courses`, `barista_recipes`

**Ремісничі (4):** `electrician`, `plumber_3rd_grade`, `carpenter_3rd_grade`,
`sewing_courses`

**Мова (2):** `english_basic`, `english_fluent`

**Інше (3):** `photography_retouching`, `industrial_climbing`, `extreme_driving`

Разом за групами: 15+15+3+2+10+2+4+4+2+3 = 60 — сходиться з фактичним
списком courses (62 мінус 2 водійських, винесених у розділ 4).

**Водіння / ліцензії (окремо, НЕ пишуться в courses — див. розділ 4):**
`driving`, `driver_В`

### Повний плаский список (62 id) для копіювання:
```
dance_gogo
pc_confident
prog_cpp
seo
visage
lash_extension
dance_twerk
electrician
video_editing
prog_php
driving
plastic_surgery_usa
waxing
polygraphy
dental_tech
bartender_flairing
pole_dance
3d_max
dental_implants
prog_csharp
contextual_ads_setup
mammoplasty_israel
plastic_surgery_austria
sport_massage
crossfit_trainer
fitness_trainer
bartender_basic
hair_colorist
dietolog
doctor_qualification_upgrade
html_css
periodontology
manicure_pedicure
english_basic
own_site_24h
permanent_makeup_full
prog_js_frameworks
hair_extension_capsule
web_design_beginners
stylist_courses
prog_python
waiter_courses
hairdresser_basic
prog_java
plumber_3rd_grade
laser_hair_removal
anticellulite_massage
face_cleaning_device
barber_professional
photography_retouching
barista_recipes
english_fluent
extreme_driving
industrial_climbing
sugaring_epilation
sewing_courses
dental_technologies_modern
bracket_systems
driver_В
carpenter_3rd_grade
mesotherapy
basic_cosmetology
```

⚠️ **`driving` і `driver_В` виключити з масиву `courses`** — вони не
записуються як звичайний курс, а одразу дають запис(и) у `licenses`
(розділ 4). Отже фактичний список **звичайних courses = 60 id** (62 мінус
ці два).

---

## 3. TRAININGS (38 значень — повний список id з cards_data.js, масив `trainings`)

```
corona_ne_zhmet
negotiation
oratory_gondalas
how_to_marry
levitas_business
parabellum_time_management
parabellum_selling_air
russian_pickup_method
alex_lesli_pickup
smm_training
psychobox
hellinger_family
carnegie_communication
tony_robbins
become_leader_10days
become_coach
nastya_rybka
china_business_kovpak
business_transformer_portnyagin
hard_negotiations
novoselov_woman_textbook
china_business_7steps
consulting_hr
chaldini_influence
loyal_clients_repeat_sales
direct_sales
karmic_management_roach
effective_ads_business
kiyosaki_rich_dad
pease_relationship_language
i_am_a_star
marathon_personal_growth
business_youth_tsekh
pavel_rakov_leadership
goal_setting
guerrilla_marketing_levinson
nick_vujicic_motivation
best_business_is_hobby
```

---

## 4. LICENSES

| ID | Здобувається через |
|---|---|
| `A` | курс `driving` |
| `B` | курс `driving` АБО курс `driver_В` |
| `C` | курс `driving` |
| `D` | курс `driving` |

Тобто `driving` одразу пише в `licenses` усі 4 значення `{A, B, C, D}`,
а `driver_В` пише лише `{B}`.

---

## 5. EXPERIENCE

Поки без готового enum — заповнюється довільним коротким описом посади,
на якій зараз/раніше працював гравець. Логіка нарахування (напр. після
скількох ходів на посаді досвід зараховується) — реалізується пізніше.
Зараз просто поле існує в профілі як `Set<ExperienceID>` (або
`Set<string>` до появи повноцінного enum).

---

## 6. PERSONAL

```
personal: {
  gender: 'M' | 'F',
  has_partner: boolean,
  children: number,          // 0..3
  can_have_relationship: boolean
}
```

Заповнюється/змінюється картками типу "Любовь" (ще не оцифровані).

---

## 7. INVENTORY

Предмети/інструменти, які гравець купує для виконання певних робіт; багато
робіт розділяють одні й ті самі предмети, тому інвентар накопичується і
повторно використовується. У `jobs_self` кожна картка з вимогою до
інвентаря має `item: <ItemID>` + `additionalCost: <number>` (сума, яку
треба сплатити, якщо предмета ще немає в `inventory[]`; якщо є — 0).

### ItemID (12 значень, з jobs_self)

| ID | Предмет | Типова вартість |
|---|---|---|
| `used_laptop` | Б/у ноутбук | $250 |
| `massage_table` | Переносний масажний стіл | $100 |
| `photo_studio_kit` | Фотоапарат + світло + декорації | $6000 |
| `pc_dual_monitor` | Потужний ПК з двома моніторами | $1000 |
| `basic_pc` | Простенький домашній ПК | $600 |
| `handyman_tools` | Набір інструментів "муж на час" | $600 |
| `sewing_machine` | Швейна машинка | $600 |
| `bicycle` | Велосипед | $100 |
| `rented_garage` | Оренда гаража | $100 |
| `car` | Автомобіль (б/у) | $4000 |
| `scooter` | Скутер | $600 |
| `pc_gpu_dual_monitor` | Потужний ПК з відеокартою і двома моніторами | $1200 |

Deals/startups поки не оцифровані на ItemID — реалізується пізніше.
