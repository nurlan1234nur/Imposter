# Imposter — Project Overview

## Нэг өгүүлбэрээр

Imposter нь Монгол, Англи, Казах хэлтэй, нэг утсыг дамжуулж тоглодог, installable PWA party game юм.

## Хөгжүүлсэн арга

Тоглоомын шаардлага, дүрэм, хэрэглэгчийн journey болон олон хэлний хэрэгцээг би тодорхойлсон. AI-аар implementation хийлгэхдээ кодыг турших, game state болон UX алдааг засах, feature-үүдийг нэгтгэх замаар өөрөө оролцож сурсан.

## Гол боломжууд

- 3 хэлний дэмжлэг
- 340 гаруй built-in үг
- Утас дамжуулж тоглох нууц мэдээллийн урсгал
- Custom profile болон lobby
- Installable PWA
- Docker/Nginx болон Vercel deployment config

## Архитектурын ойлголт

UI нь lobby → player reveal → round → vote/result гэсэн state transition-уудаар явна. PWA layer нь installability болон cached assets хариуцна. Docker build нь static frontend-ийг Nginx-ээр serve хийхэд бэлтгэнэ.

## Миний сурсан зүйл

- Нэг дэлгэц дээр нууц мэдээлэл алдагдуулахгүй UX зохиох
- Complex UI state-ийг шат дараалсан transition болгон задлах
- Localization хийхдээ текстээс гадна layout, үгийн санг бодолцох
- Web app-ийг PWA болон container хэлбэрээр хүргэх

## Сайжруулах дараалал

1. Game rules/state-ийг UI component-оос тусгаарлах.
2. Critical state transition бүрд unit test нэмэх.
3. Offline cache update болон version migration-г шалгах.
4. Accessibility, keyboard navigation, жижиг дэлгэцийн QA хийх.

## Portfolio-д хэрэглэх тодорхойлолт

> Өөрийн шаардлагаар AI-assisted байдлаар хөгжүүлсэн 3 хэлтэй PWA party game. Би game flow, localization, responsive UX, offline capability болон Docker delivery-г ойлгож хэрэгжүүлэхэд оролцсон.

