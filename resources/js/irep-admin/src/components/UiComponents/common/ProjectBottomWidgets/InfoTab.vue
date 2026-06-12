<script setup lang="ts">
const contactAdminUrl =
  (irePlugin as typeof irePlugin & { contact_admin_url?: string })?.contact_admin_url || "#";
</script>

<template>
  <div class="flex flex-col gap-3">
    <a href="https://interactive-real-estate.vercel.app" target="_blank" class="animate-pulse underline">
      Our website
    </a>

    <a
      href="https://wordpress.org/support/plugin/interactive-real-estate/reviews/#new-post"
      target="_blank"
      class="animate-pulse underline"
    >
      Give us a review ⭐ 🙏
    </a>

    <a :href="contactAdminUrl" class="animate-pulse underline">
      Found a bug? 🐞 Help us improve the plugin
    </a>
  </div>
</template>
