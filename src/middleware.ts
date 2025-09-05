import { jwtDecode } from "jwt-decode"; 
import { tokenType } from "../interfaces/token";
import Cookies from "js-cookie";
import { NextRequest, NextResponse } from "next/server"; 
    // if(token){
    //     try {
    //         const decoded = jwtDecode<tokenType>(token);
    //         console.log('Decoded token:', decoded);
    
    //         if(decoded.role! === 'admin'){
                
    //             console.log("You are not Authorized to Admin Dashboard")
    //         }
    //     } catch (error: any) {
    //         console.error("Token not access", error.message)
    //     }
      
    // }


export async function middleware(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value
    if(!token) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

     const decoded = jwtDecode<tokenType>(token);
     const role = decoded.role
     if(!role) {
        return NextResponse.redirect(new URL("/login", request.url))
     }

     const {pathname} = request.nextUrl
     if(pathname.startsWith('/admin')) {
        if(decoded.role === "customer") {
            return NextResponse.redirect(new URL("/customer", request.url))
        }
     } else if (pathname.startsWith('/customer')) {
        if(decoded.role === 'admin') {
            return NextResponse.redirect(new URL("/admin", request.url))
        }
     } else if (pathname.startsWith('/login')) {
        if(role==="admin") {
            return NextResponse.redirect(new URL("/admin", request.url))
        } else {
            return NextResponse.redirect(new URL('/customer', request.url))
        }
     }
     return NextResponse.next();
    
}

export const config = {
    matcher: ["/admin/:path*"],
}

