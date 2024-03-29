import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

// função para paginas que só pode ser acessada por visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);

        // Se o usuário tentar a página tando já logado, redirecionamos
        if(cookies['@projetopizza.token']) {
            return {
                redirect:{
                    destination: '/dashboard',
                    permanent: false,
                }
            }
        }
        return await fn(ctx);
    }
}