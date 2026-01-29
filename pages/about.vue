<template>
  <div class="container py-8 md:py-12">
    <!-- Заголовок -->
    <div class="mb-8 md:mb-12">
      <h1 class="text-2xl md:text-3xl font-bold text-dark mb-4">
        О нас
      </h1>
      <div class="w-16 h-1 bg-orange rounded-full" />
    </div>

    <!-- Основной контент -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
      <!-- Левая колонка с текстом -->
      <div class="space-y-6">
        <div class="bg-[#F8F9FA] rounded-2xl p-6 md:p-8">
          <h2 class="text-xl font-bold text-dark mb-4">
            Chakana — ваш надежный помощник в покупках
          </h2>
          <p class="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
            Chakana — это современная платформа для удобных покупок в ближайших магазинах. Мы объединяем покупателей и продавцов, предоставляя простой и быстрый способ найти нужные товары рядом с вами.
          </p>
          <p class="text-sm md:text-base text-gray-600 leading-relaxed">
            Наша миссия — сделать повседневные покупки максимально удобными и выгодными для каждого пользователя.
          </p>
        </div>

        <div class="bg-[#F8F9FA] rounded-2xl p-6 md:p-8">
          <h2 class="text-xl font-bold text-dark mb-4">
            Наши преимущества
          </h2>
          <ul class="space-y-4">
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange/10 flex-center shrink-0 mt-0.5">
                <IconCheck class="w-3.5 h-3.5 text-orange" />
              </div>
              <p class="text-sm md:text-base text-gray-600">
                Широкий выбор магазинов и товаров в вашем районе
              </p>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange/10 flex-center shrink-0 mt-0.5">
                <IconCheck class="w-3.5 h-3.5 text-orange" />
              </div>
              <p class="text-sm md:text-base text-gray-600">
                Актуальные цены и информация о наличии товаров
              </p>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange/10 flex-center shrink-0 mt-0.5">
                <IconCheck class="w-3.5 h-3.5 text-orange" />
              </div>
              <p class="text-sm md:text-base text-gray-600">
                Удобный поиск и фильтрация по категориям
              </p>
            </li>
            <li class="flex items-start gap-3">
              <div class="w-6 h-6 rounded-full bg-orange/10 flex-center shrink-0 mt-0.5">
                <IconCheck class="w-3.5 h-3.5 text-orange" />
              </div>
              <p class="text-sm md:text-base text-gray-600">
                Программа лояльности и эксклюзивные скидки
              </p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Правая колонка -->
      <div class="space-y-6">
        <div class="bg-gradient-to-br from-orange to-[#FF6B35] rounded-2xl p-6 md:p-8 text-white">
          <h2 class="text-xl font-bold mb-4">
            Почему выбирают Chakana?
          </h2>
          <div class="grid grid-cols-2 gap-4 md:gap-6">
            <div class="text-center p-4 bg-white/10 rounded-xl">
              <p class="text-3xl md:text-4xl font-bold mb-1">500+</p>
              <p class="text-sm opacity-90">Магазинов</p>
            </div>
            <div class="text-center p-4 bg-white/10 rounded-xl">
              <p class="text-3xl md:text-4xl font-bold mb-1">50K+</p>
              <p class="text-sm opacity-90">Товаров</p>
            </div>
            <div class="text-center p-4 bg-white/10 rounded-xl">
              <p class="text-3xl md:text-4xl font-bold mb-1">100K+</p>
              <p class="text-sm opacity-90">Пользователей</p>
            </div>
            <div class="text-center p-4 bg-white/10 rounded-xl">
              <p class="text-3xl md:text-4xl font-bold mb-1">24/7</p>
              <p class="text-sm opacity-90">Поддержка</p>
            </div>
          </div>
        </div>

        <div class="bg-[#F8F9FA] rounded-2xl p-6 md:p-8">
          <h2 class="text-xl font-bold text-dark mb-4">
            Свяжитесь с нами
          </h2>
          <div class="space-y-4">
            <a 
              href="tel:+998712000000" 
              class="flex items-center gap-3 text-gray-600 hover:text-orange transition-300"
            >
              <div class="w-10 h-10 rounded-full bg-orange/10 flex-center shrink-0">
                <IconPhone class="w-5 h-5 text-orange" />
              </div>
              <div>
                <p class="text-xs text-gray-400">Телефон</p>
                <p class="text-sm md:text-base font-medium">+998 71 200 00 00</p>
              </div>
            </a>
            <a 
              href="mailto:info@chakana.uz" 
              class="flex items-center gap-3 text-gray-600 hover:text-orange transition-300"
            >
              <div class="w-10 h-10 rounded-full bg-orange/10 flex-center shrink-0">
                <IconPhone class="w-5 h-5 text-orange" />
              </div>
              <div>
                <p class="text-xs text-gray-400">Email</p>
                <p class="text-sm md:text-base font-medium">info@chakana.uz</p>
              </div>
            </a>
            <div class="flex items-center gap-3 text-gray-600">
              <div class="w-10 h-10 rounded-full bg-orange/10 flex-center shrink-0">
                <IconLocation class="w-5 h-5 text-orange" />
              </div>
              <div>
                <p class="text-xs text-gray-400">Адрес</p>
                <p class="text-sm md:text-base font-medium">г. Ташкент, ул. Амира Темура, 123</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Социальные сети -->
        <div class="flex items-center gap-4">
          <a 
            href="https://t.me/chakana_uz" 
            target="_blank" 
            class="w-12 h-12 rounded-full bg-[#F8F9FA] flex-center hover:bg-orange/10 transition-300 group"
          >
            <img src="/images/svg/socials/telegram-gradient.svg" alt="Telegram" class="w-6 h-6" />
          </a>
          <a 
            href="https://instagram.com/chakana_uz" 
            target="_blank" 
            class="w-12 h-12 rounded-full bg-[#F8F9FA] flex-center hover:bg-orange/10 transition-300 group"
          >
            <img src="/images/svg/socials/instagram-gradient.svg" alt="Instagram" class="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconCheck from '~/assets/icons/Common/check.svg'
import IconPhone from '~/assets/icons/Common/phone.svg'
import IconMail from '~/assets/icons/Common/mail.svg'
import IconLocation from '~/assets/icons/Common/location.svg'

useHead({
  title: 'О нас — Chakana',
})
</script>
