import { useEffect, useState } from "react";
import InfoMagServices from "../Services/InfoMagServices";
import './styles/TopBanner.css';



const TopBanner = () => {
    const [messages, setMessages] = useState([]);
    const [index, setIndex] = useState(0);


    const fetchTopBanner = async () => {
        try {
            const response = await InfoMagServices.getTopBannerMessages();
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching top banner:", error);
        }
    }

    useEffect(() => {
        fetchTopBanner();
    }
    , []);

    useEffect(() => {
        if (!messages || messages.length === 0) return;
    
        const interval = setInterval(() => {
          setIndex((prev) => (prev + 1) % messages.length);
        }, 8000);
    
        return () => clearInterval(interval);
      }, [messages]);

    return <>
        <div className="top-banner">
      <div
        className="slider"
        style={{ transform: `translateY(-${index * 40}px)` }}

      >
        {messages.map((msg, i) => (
          <div className="slide" key={i}>
            <span className="slide-text">{msg.message}</span>
          </div>
        ))}
      </div>
    </div>
    </>;
}

export default TopBanner;