"use client";

import { BadgeCheck, Camera, Info } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CadastroDraft } from "@/lib/influenciador/cadastro-types";
import { cn } from "@/lib/utils";

type PassoDadosBasicosProps = {
  draft: CadastroDraft;
  onChange: (partial: Partial<CadastroDraft>) => void;
  errors: Record<string, string>;
};

export function PassoDadosBasicos({
  draft,
  onChange,
  errors,
}: PassoDadosBasicosProps) {
  const fotoInputRef = useRef<HTMLInputElement>(null);
  const bioLength = draft.bio.length;
  const dadosEssenciaisOk =
    draft.nome.trim().length >= 2 && draft.bio.trim().length >= 20;

  function handleFotoChange(file: File | null) {
    if (draft.fotoPerfilUrl) {
      URL.revokeObjectURL(draft.fotoPerfilUrl);
    }
    if (!file) {
      onChange({ fotoPerfilUrl: null });
      return;
    }
    onChange({ fotoPerfilUrl: URL.createObjectURL(file) });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-lg font-bold">Dados básicos</h2>
        <p className="text-texto-secundario text-sm font-normal">
          Essas informações aparecem no seu perfil profissional para empresas.
        </p>
      </div>

      <div className="secao-editavel space-y-6">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
        <div
          className="border-border bg-muted relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border"
          aria-hidden={!draft.fotoPerfilUrl}
        >
          {draft.fotoPerfilUrl ? (
            <Image
              src={draft.fotoPerfilUrl}
              alt="Preview da foto de perfil"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <Camera className="text-muted-foreground size-8" />
          )}
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <Label htmlFor="foto-perfil">Foto de perfil (opcional)</Label>
          <input
            ref={fotoInputRef}
            id="foto-perfil"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) =>
              handleFotoChange(e.target.files?.[0] ?? null)
            }
          />
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fotoInputRef.current?.click()}
            >
              Escolher foto
            </Button>
            {draft.fotoPerfilUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleFotoChange(null);
                  if (fotoInputRef.current) fotoInputRef.current.value = "";
                }}
              >
                Remover
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nome">
          Nome <span className="text-destructive">*</span>
        </Label>
        <Input
          id="nome"
          value={draft.nome}
          onChange={(e) => onChange({ nome: e.target.value })}
          aria-invalid={!!errors.nome}
          aria-describedby={errors.nome ? "nome-error" : undefined}
          placeholder="Como você é conhecido(a) profissionalmente"
          autoComplete="name"
        />
        {errors.nome ? (
          <p id="nome-error" role="alert" className="text-destructive text-sm">
            {errors.nome}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="bio">Bio</Label>
          <span
            className={cn(
              "font-data text-xs",
              bioLength > 500 ? "text-destructive" : "text-texto-secundario",
            )}
            aria-live="polite"
          >
            {bioLength}/500
          </span>
        </div>
        <Textarea
          id="bio"
          value={draft.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          aria-invalid={!!errors.bio}
          aria-describedby={errors.bio ? "bio-error" : undefined}
          placeholder="Conte brevemente sobre seu trabalho, estilo de conteúdo e diferenciais..."
          rows={4}
          maxLength={500}
        />
        {errors.bio ? (
          <p id="bio-error" role="alert" className="text-destructive text-sm">
            {errors.bio}
          </p>
        ) : null}
      </div>

      <div
        className="banner-informativo flex gap-3 rounded-card p-4"
        role="note"
      >
        {dadosEssenciaisOk ? (
          <BadgeCheck
            className="text-verde-neon mt-0.5 size-4 shrink-0"
            aria-hidden
          />
        ) : (
          <Info className="text-verde-neon mt-0.5 size-4 shrink-0" aria-hidden />
        )}
        <p className="text-sm">
          {dadosEssenciaisOk ? (
            <>
              <span className="text-verde-neon font-medium">
                Dados essenciais preenchidos
              </span>{" "}
              — perfis completos e verificados recebem prioridade no match com
              empresas.
            </>
          ) : (
            <>
              <span className="text-verde-neon font-medium">Perfis completos</span>{" "}
              e verificados recebem prioridade no match com empresas. Dedique
              alguns minutos para preencher com atenção.
            </>
          )}
        </p>
      </div>
      </div>
    </div>
  );
}
