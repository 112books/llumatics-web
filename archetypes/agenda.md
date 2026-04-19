---
title: "{{ replace .File.ContentBaseName "-" " " | title }}"
course_ref: ""        # slug del taller (ex: "revelat-bn")
date_start: ""        # ex: "2026-05-10"
date_end: ""          # ex: "2026-05-11" (opcional, si és multidia)
time_start: ""        # ex: "10:00"
time_end: ""          # ex: "14:00"
location: "Laboratori Llumàtics, Barcelona"
duration: ""
price: 0
max_places: 6
status: "active"      # active | full | soon | cancelled
date: {{ .Date }}
draft: false
---
