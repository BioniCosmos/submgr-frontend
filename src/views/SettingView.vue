<template>
  <div class="flex flex-1 flex-col gap-4 md:gap-8">
    <div class="mx-auto grid w-full max-w-6xl gap-2">
      <h1 class="text-3xl font-semibold">Settings</h1>
    </div>
    <div
      class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
    >
      <nav class="grid gap-4 text-sm text-muted-foreground">
        <RouterLink
          to="/setting/account"
          active-class="font-semibold text-primary"
        >
          Account
        </RouterLink>
        <RouterLink
          to="/setting/server"
          active-class="font-semibold text-primary"
        >
          Server
        </RouterLink>
        <RouterLink
          to="/setting/smtp"
          active-class="font-semibold text-primary"
        >
          SMTP
        </RouterLink>
      </nav>
      <div class="grid gap-6">
        <RouterView />
      </div>
    </div>
  </div>
</template>
