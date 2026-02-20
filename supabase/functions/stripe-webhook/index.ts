import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const { method } = req;
  if (method === 'OPTIONS') return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } });

  try {
    const body = await req.json();
    
    // O Stripe envia este evento quando o pagamento é aprovado
    if (body.type === 'checkout.session.completed') {
      const session = body.data.object;
      const email = session.customer_details.email;

      // Conecta ao seu banco de dados
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Atualiza o status para 'premium' na tabela profiles
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'premium' })
        .eq('email_do_usuario', email); // Ajuste: se não tiver e-mail na profiles, usamos o ID

      console.log(`Usuário ${email} agora é Premium!`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    return new Response(err.message, { status: 400 });
  }
})