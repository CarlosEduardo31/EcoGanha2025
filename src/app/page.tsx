import { Cellphone } from "@/components/landingpage/cellphone";
import { Header } from "@/components/landingpage/header";
import { Cadastre } from "@/components/landingpage/cadastre";
import { Content } from "@/components/landingpage/content";
import { Carrossel } from "@/components/landingpage/carrossel";
import { Convite } from "@/components/landingpage/convite";
import { Footer } from "@/components/landingpage/footer";
import { HowItWorks } from "@/components/landingpage/how-it-works";
import { Partners } from "@/components/landingpage/partners";
import "@fontsource/poppins";

export default function Home() {
  return (
    <main className="">
      <Header></Header>
      <Cellphone></Cellphone>
      <HowItWorks></HowItWorks>
      <Content></Content>
      <Carrossel></Carrossel>
      {/* <Convite></Convite> */}
      <Cadastre></Cadastre>
      <Partners></Partners>
      <Footer></Footer>
    </main>
  );
}
