import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenError } from "../services/errors/AuthTokenError";

// funçao para paginas que só usuarios logados podem acessar
export function canSSRAuth<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        const token = cookies['@projetopizza.token'];

        if(!token){
            return{
                redirect:{
                    destination: "/",
                    permanent: false,
                }
            }
        }

        try{
            return await fn(ctx);
        }catch(err){
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@projetopizza.token');

                return{
                    redirect:{
                        destination: "/",
                        permanent:false,
                    }
                }
            }
        }
    }
}