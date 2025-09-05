import Cookies from "js-cookie"
import { SetTokensArgs } from "../interfaces/userDetails"

export const setTokens =({ accessToken } : SetTokensArgs) =>{
Cookies.set('accessToken', accessToken, {secure:true, sameSite: 'Lax'})    

}

export const getAccessToken = (): string | undefined => {
  return Cookies.get('accessToken');
};

export const removeTokens = () =>{
    Cookies.remove('accessToken');
}