"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function EsqueciSenhaForm() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Informe seu e-mail.");
      return;
    }
    setEnviando(true);
    window.setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
    }, 600);
  }

  if (enviado) {
    return (
      <div className="space-y-6 text-center">
        <div className="icone-marca mx-auto size-14">
          <Mail className="size-6" aria-hidden />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-xl font-bold lg:hidden">
            Verifique seu e-mail
          </h1>
          <p className="text-texto-secundario text-sm leading-relaxed font-normal">
            Se existir uma conta com{" "}
            <span className="text-foreground font-medium">{email.trim()}</span>,
            você receberá instruções para redefinir a senha em alguns minutos.
          </p>
          <p className="text-texto-secundario text-xs font-normal">
            Não recebeu? Verifique a caixa de spam ou tente novamente em alguns
            minutos.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => {
              setEnviado(false);
              setEmail("");
            }}
          >
            Tentar outro e-mail
          </Button>
          <Link
            href="/login"
            className={cn(
              "text-lilas-escuro text-sm font-medium hover:underline",
            )}
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 lg:hidden">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Recuperar senha
        </h1>
        <p className="text-texto-secundario text-sm font-normal">
          Informe o e-mail da sua conta e enviaremos um link de redefinição.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="secao-editavel space-y-4 ring-0">
        <div className="space-y-2">
          <Label htmlFor="recuperar-email" className="font-normal">
            E-mail
          </Label>
          <Input
            id="recuperar-email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-cinza-200 bg-white"
            required
          />
        </div>
        <Button
          type="submit"
          variant="cta"
          className="w-full"
          disabled={enviando}
        >
          {enviando ? "Enviando…" : "Enviar link de recuperação"}
        </Button>
      </form>

      <p className="text-texto-secundario text-center text-sm font-normal">
        Lembrou a senha?{" "}
        <Link
          href="/login"
          className="text-lilas-escuro font-medium hover:underline"
        >
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
