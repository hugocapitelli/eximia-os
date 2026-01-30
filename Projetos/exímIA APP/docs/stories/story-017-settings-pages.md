# Story EXIMIA-017: Settings Pages

**Story ID:** EXIMIA-017
**Epic:** EXIMIA-EPIC-007 (User Experience)
**Sprint:** 5
**Pontos:** 8
**Prioridade:** P1 (Alto)
**Depende de:** EXIMIA-010 (Auth Pages), EXIMIA-007 (Templates)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** poder configurar minha conta e preferências,
**Para que** eu tenha controle sobre minha experiência.

---

## Acceptance Criteria

### Profile Settings
- [ ] Atualizar nome
- [ ] Atualizar avatar (upload)
- [ ] Atualizar bio
- [ ] Ver email (read-only)

### Security Settings
- [ ] Alterar senha
- [ ] Ver sessões ativas
- [ ] Logout de todas sessões
- [ ] Deletar conta (com confirmação)

### Notifications Settings
- [ ] Toggle notificações push
- [ ] Toggle email digest
- [ ] Toggle habit reminders
- [ ] Horário de quiet hours

### Appearance Settings
- [ ] Toggle dark/light mode (preparar UI)
- [ ] Selecionar tema de cor (futuro)
- [ ] Tamanho de fonte

---

## Technical Details

### Profile API

```typescript
// lib/actions/settings/profile.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  full_name?: string;
  avatar_url?: string;
  bio?: string;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.auth.updateUser({
    data: {
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      bio: data.bio,
    },
  });

  if (error) throw new Error(error.message);

  revalidatePath("/settings/profile");
}

export async function uploadAvatar(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const file = formData.get("avatar") as File;
  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop();
  const path = `avatars/${user.id}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  await updateProfile({ avatar_url: publicUrl });

  return publicUrl;
}
```

### Security API

```typescript
// lib/actions/settings/security.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const supabase = createClient();

  // Verify current password
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: (await supabase.auth.getUser()).data.user?.email || "",
    password: data.currentPassword,
  });

  if (verifyError) throw new Error("Senha atual incorreta");

  // Update password
  const { error } = await supabase.auth.updateUser({
    password: data.newPassword,
  });

  if (error) throw new Error(error.message);
}

export async function deleteAccount() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Delete user data (cascade will handle related tables)
  // For now, just sign out
  await supabase.auth.signOut();

  redirect("/login?message=account_deleted");
}
```

### Settings Page

```tsx
// app/(dashboard)/settings/profile/page.tsx
"use client";

import { useState, useTransition } from "react";
import { SettingsLayout } from "@/components/templates/SettingsLayout";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Textarea, Avatar } from "@/components/ui";
import { updateProfile, uploadAvatar } from "@/lib/actions/settings/profile";
import { useToast } from "@/components/ui/Toast";

export default function ProfileSettingsPage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateProfile(formData);
        toast({ variant: "success", title: "Perfil atualizado!" });
      } catch (error) {
        toast({ variant: "error", title: "Erro", description: (error as Error).message });
      }
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await uploadAvatar(formData);
      toast({ variant: "success", title: "Avatar atualizado!" });
    } catch (error) {
      toast({ variant: "error", title: "Erro", description: (error as Error).message });
    }
  };

  return (
    <SettingsLayout activeHref="/settings/profile">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar name={formData.full_name} size="xl" />
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <Button type="button" variant="secondary">
                      Alterar avatar
                    </Button>
                  </label>
                  <p className="text-xs text-zinc-500 mt-1">JPG, PNG ou GIF. Máx 2MB.</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Nome completo
                </label>
                <Input
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1">
                  Bio
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Conte um pouco sobre você..."
                  rows={3}
                />
              </div>

              <Button type="submit" loading={isPending}>
                Salvar alterações
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </SettingsLayout>
  );
}
```

---

## Tasks

- [ ] Implementar profile API actions
- [ ] Implementar security API actions
- [ ] Criar Profile settings page
- [ ] Criar Security settings page
- [ ] Criar Notifications settings page (UI)
- [ ] Criar Appearance settings page (UI)
- [ ] Implementar avatar upload
- [ ] Implementar change password
- [ ] Implementar delete account
- [ ] Testar todos os fluxos

---

## Definition of Done

- [ ] Profile edit funcionando
- [ ] Avatar upload funcionando
- [ ] Change password funcionando
- [ ] Delete account funcionando
- [ ] TypeScript sem erros (`npm run typecheck`)
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/
├── lib/
│   └── actions/
│       └── settings/
│           ├── profile.ts        [CREATE]
│           ├── security.ts       [CREATE]
│           └── preferences.ts    [CREATE]
└── components/
    └── settings/
        ├── ProfileForm.tsx       [CREATE]
        ├── AvatarUpload.tsx      [CREATE]
        ├── PasswordForm.tsx      [CREATE]
        ├── DeleteAccountModal.tsx [CREATE]
        ├── NotificationSettings.tsx [CREATE]
        ├── AppearanceSettings.tsx [CREATE]
        └── index.ts              [CREATE]

app/(dashboard)/settings/
├── layout.tsx                    [CREATE]
├── page.tsx                      [CREATE] (redirect to profile)
├── profile/
│   └── page.tsx                  [CREATE]
├── security/
│   └── page.tsx                  [CREATE]
├── notifications/
│   └── page.tsx                  [CREATE]
└── appearance/
    └── page.tsx                  [CREATE]

src/components/templates/
└── SettingsLayout.tsx            [CREATE]
```

---

**Story criada por River (SM)**
**Data:** 2026-01-29
