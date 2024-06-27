<script setup lang="ts">
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AutoForm, AutoFormLabel } from '@/components/ui/auto-form'
import { beautifyObjectName } from '@/components/ui/auto-form/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ky from '@/ky'
import { useAccount, type Account } from '@/type/account'
import type { DefaultResponse } from '@/type/default-response'
import type { HTTPError } from 'ky'
import { AlertCircle } from 'lucide-vue-next'
import type { GenericObject } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'

const router = useRouter()

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const errorMessage = ref('')

const submit = (event: GenericObject) => {
  const account = useAccount()
  return ky
    .post('api/account/sign-in', { json: event })
    .json<Account>()
    .then((body) => {
      account.value = body
    })
    .then(() => router.push('/'))
    .catch(async (error: HTTPError) => {
      if (error.response.status === 400 || error.response.status === 404) {
        const body: DefaultResponse = await error.response.json()
        errorMessage.value = body.message
      }
    })
}
</script>

<template>
  <div class="flex items-center justify-center h-dvh">
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert v-if="errorMessage !== ''" variant="destructive" class="mb-4">
          <AlertCircle class="w-4 h-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {{ errorMessage }}
          </AlertDescription>
        </Alert>
        <AutoForm class="space-y-4" :schema="schema" @submit="submit">
          <template #password="{ shape, fieldName }">
            <FormField v-slot="{ componentField }" :name="fieldName">
              <FormItem>
                <div class="flex items-center">
                  <AutoFormLabel :required="shape.required">
                    {{ beautifyObjectName(fieldName) }}
                  </AutoFormLabel>
                  <a href="#" class="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </a>
                </div>
                <FormControl>
                  <Input type="password" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </template>
          <template v-slot="{ submitting }">
            <Button class="w-full" :disabled="submitting">Login</Button>
          </template>
        </AutoForm>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <RouterLink to="/sign-up" class="underline">Sign up</RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
