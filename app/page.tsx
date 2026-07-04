import Hero from "./components/Hero"
import WearYourStory from "./components/WearYourStory"
import FeatureCarousel from "./components/FeatureCarousel"
import PortfolioGrid from "./components/PortfolioGrid"
import GitHubRepos from "./components/GitHubRepos"
import Timeline from "./components/Timeline"
import Marquee from "./components/Marquee"
import ContactForm from "./components/ContactForm"
import NewsletterSubscribe from "./components/NewsletterSubscribe"
import { AIAssistant } from "./components/ai-assistant"

export default function Home() {
  return (
    <>
      <Hero />
      <WearYourStory />
      <FeatureCarousel />
      <PortfolioGrid />
      <GitHubRepos /> {/* GitHub项目展示 - 自动获取78个项目 */}
      <Timeline />
      <Marquee />
      <ContactForm />
      <NewsletterSubscribe />
      <AIAssistant />
    </>
  )
}
