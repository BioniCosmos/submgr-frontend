<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { CircleUser, Menu } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen w-full">
    <header
      class="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6"
    >
      <nav
        class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
      >
        <!-- <a
          href="#"
          class="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 class="h-6 w-6" />
          <span class="sr-only">Acme Inc</span>
        </a> -->
        <RouterLink
          to="/"
          class="text-foreground transition-colors hover:text-foreground"
          active-class="!text-foreground"
        >
          Dashboard
        </RouterLink>
        <RouterLink
          to="/nodes"
          class="text-muted-foreground transition-colors hover:text-foreground"
          active-class="!text-foreground"
        >
          Nodes
        </RouterLink>
        <RouterLink
          to="/users"
          class="text-muted-foreground transition-colors hover:text-foreground"
          active-class="!text-foreground"
        >
          Users
        </RouterLink>
      </nav>
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" size="icon" class="shrink-0 md:hidden">
            <Menu class="h-5 w-5" />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav class="grid gap-6 text-lg font-medium">
            <!-- <a href="#" class="flex items-center gap-2 text-lg font-semibold">
              <Package2 class="h-6 w-6" />
              <span class="sr-only">Acme Inc</span>
            </a> -->
            <RouterLink to="/" class="hover:text-foreground">
              Dashboard
            </RouterLink>
            <RouterLink
              to="/nodes"
              class="text-muted-foreground hover:text-foreground"
            >
              Nodes
            </RouterLink>
            <RouterLink
              to="/users"
              class="text-muted-foreground hover:text-foreground"
            >
              Users
            </RouterLink>
          </nav>
        </SheetContent>
      </Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="secondary" size="icon" class="rounded-full ml-auto">
            <CircleUser class="h-5 w-5" />
            <span class="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem as-child>
            <RouterLink to="/setting/account">Settings</RouterLink>
          </DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
    <main
      class="p-4 md:p-10 bg-muted/40 min-h-[calc(100vh_-_theme(spacing.16))]"
    >
      <RouterView />
    </main>
  </div>
</template>
