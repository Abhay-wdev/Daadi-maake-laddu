import Image from "next/image";
import HeroSection from "./components/HeroSection";
import SubCategorySection from "./components/SubCategorySection";
import ProductsPage from "./components/Productspage";
import WhyChooseUs from "./components/WhyChooseUs";
import HandmadeSection from "./components/HandmadeSection";
import ReviewSection from "./components/ReviewSection";
 
 
import Blog from "./components/Blog";
 

export default function Home() {
  return (
   <>
   <HeroSection/>
   <SubCategorySection/>
   <HandmadeSection/>
   <ProductsPage/>
   <ReviewSection/>
   <WhyChooseUs/>
   <Blog/>
    
  
   </>
  );
}
