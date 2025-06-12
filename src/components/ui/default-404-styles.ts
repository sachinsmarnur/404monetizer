export const getDefault404Styles = (theme: 'modern' | 'minimal' | 'creative' | 'professional' = 'modern') => {
  const themes = {
    modern: `
      body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .background-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0);
        background-size: 20px 20px;
        animation: float 20s ease-in-out infinite;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      .container {
        max-width: 900px;
        margin: 0 auto;
        padding: 2rem;
        position: relative;
        z-index: 2;
        width: 100%;
      }
      
      .main-content {
        text-align: center;
        margin-bottom: 3rem;
        width: 100%;
      }
      
      .error-code {
        font-size: 8rem;
        font-weight: 900;
        background: linear-gradient(135deg, #fff, #f0f0f0);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 8px 32px rgba(0,0,0,0.3);
        margin-bottom: 1rem;
        line-height: 1;
        animation: float 3s ease-in-out infinite;
      }
      
      .error-title {
        font-size: 3rem;
        font-weight: 700;
        color: white;
        margin-bottom: 1rem;
        line-height: 1.2;
      }
      
      .error-description {
        font-size: 1.25rem;
        color: white;
        opacity: 0.9;
        margin-bottom: 2rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.6;
      }
      
      .action-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 2rem 0;
        flex-wrap: wrap;
      }
      
      .btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 14px 28px;
        border-radius: 14px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: none;
        box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        min-width: 120px;
        text-align: center;
        justify-content: center;
      }
      
      .btn-primary:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 30px rgba(102, 126, 234, 0.6);
      }
      
      .social-icons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 3rem 0;
        flex-wrap: wrap;
      }
      
      .social-icon {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        color: white;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
      
      .social-icon:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      }
      
      /* Monetization sections - FORCE vertical stacking with mobile responsiveness */
      .monetization-features-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .monetization-section,
      .lead-magnet, 
      .sponsored-content, 
      .donation-button, 
      .newsletter-signup,
      .product-showcase, 
      .social-proof, 
      .exit-intent, 
      .email-collection,
      .content-lock, 
      .countdown-offer, 
      .affiliate-links {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 20px;
        padding: 2rem;
        margin: 2rem auto;
        box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 800px;
        display: block !important;
        float: none !important;
        clear: both !important;
        position: relative !important;
      }
      
      /* Affiliate links grid inside monetization section */
      .affiliate-links.monetization-section {
        display: block !important;
      }
      
      .affiliate-links .affiliate-link {
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        padding: 1.5rem;
        text-decoration: none;
        color: #333;
        transition: all 0.3s ease;
        display: block;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
      }
      
      .affiliate-links .affiliate-link:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
      }
      
      .affiliate-links .affiliate-link img {
        width: 100%;
        max-width: 200px;
        height: 120px;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 1rem;
      }
      
      input[type="email"] {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 10px;
        padding: 0.75rem 1rem;
        color: white;
        width: 100%;
        max-width: 300px;
        margin: 0.5rem auto;
        backdrop-filter: blur(10px);
        display: block;
      }
      
      input[type="email"]::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
      
      /* Product grid should be grid but inside its container */
      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      
      .product-card {
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        border-radius: 10px;
        padding: 1rem;
        text-align: center;
      }
      
      /* Testimonials grid should be grid but inside its container */
      .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      
      .testimonial-card {
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        border-radius: 10px;
        padding: 1rem;
      }
      
      .rating {
        color: #ffd700;
      }
      
      /* Mobile Responsiveness */
      @media (max-width: 768px) {
        .container {
          padding: 1rem;
        }
        
        .monetization-features-container {
          padding: 0 0.5rem;
        }
        
        .monetization-section,
        .lead-magnet, 
        .sponsored-content, 
        .donation-button, 
        .newsletter-signup,
        .product-showcase, 
        .social-proof, 
        .exit-intent, 
        .email-collection,
        .content-lock, 
        .countdown-offer, 
        .affiliate-links {
          padding: 1.5rem;
          margin: 1.5rem auto;
        }
        
        .error-code {
          font-size: 4rem;
        }
        
        .error-title {
          font-size: 2rem;
        }
        
        .error-description {
          font-size: 1rem;
        }
        
        .action-buttons {
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }
        
        .btn-primary {
          width: 100%;
          max-width: 250px;
          padding: 12px 24px;
          font-size: 0.9rem;
        }
        
        .social-icons {
          gap: 0.5rem;
        }
        
        .social-icon {
          padding: 10px 16px;
          font-size: 0.85rem;
        }
        
        .product-grid {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        
        .testimonials-grid {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        
        input[type="email"] {
          max-width: 100%;
          margin: 0.5rem 0;
        }
      }
      
      @media (max-width: 480px) {
        .container {
          padding: 0.75rem;
        }
        
        .monetization-section,
        .lead-magnet, 
        .sponsored-content, 
        .donation-button, 
        .newsletter-signup,
        .product-showcase, 
        .social-proof, 
        .exit-intent, 
        .email-collection,
        .content-lock, 
        .countdown-offer, 
        .affiliate-links {
          padding: 1rem;
          margin: 1rem auto;
        }
        
        .error-code {
          font-size: 3rem;
        }
        
        .error-title {
          font-size: 1.5rem;
        }
        
        .btn-primary {
          padding: 10px 20px;
          font-size: 0.85rem;
        }
      }
    `,
    
    minimal: `
      body {
        margin: 0;
        padding: 2rem;
        min-height: 100vh;
        background: #f8f9fa;
        color: #2d3748;
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .container {
        text-align: center;
        max-width: 900px;
        width: 100%;
        margin: 0 auto;
      }
      
      .error-code {
        font-size: clamp(6rem, 12vw, 10rem);
        font-weight: 300;
        margin: 0;
        color: #4a5568;
        letter-spacing: -0.05em;
      }
      
      .title {
        font-size: clamp(1.25rem, 3vw, 2rem);
        margin: 1rem 0;
        font-weight: 400;
        color: #2d3748;
      }
      
      .description {
        font-size: clamp(0.875rem, 2vw, 1.125rem);
        margin: 1.5rem 0 2rem;
        color: #718096;
        line-height: 1.6;
      }
      
      .social-icons {
        display: flex;
        justify-content: center;
        gap: 0.5rem;
        margin: 2rem 0;
        flex-wrap: wrap;
      }
      
      .social-icon {
        display: inline-flex;
        align-items: center;
        padding: 0.5rem 1rem;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        color: #4a5568;
        text-decoration: none;
        transition: all 0.2s ease;
        font-size: 0.875rem;
      }
      
      .social-icon:hover {
        border-color: #cbd5e0;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      /* Monetization sections - FORCE vertical stacking with mobile responsiveness */
      .monetization-features-container {
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .monetization-section,
      .lead-magnet, 
      .sponsored-content, 
      .donation-button, 
      .newsletter-signup,
      .product-showcase, 
      .social-proof, 
      .exit-intent, 
      .email-collection,
      .content-lock, 
      .countdown-offer, 
      .affiliate-links {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        margin: 2rem auto;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 700px;
        display: block !important;
        float: none !important;
        clear: both !important;
        position: relative !important;
      }
      
      .btn-primary {
        background: #4299e1;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 120px;
        text-align: center;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      
      .btn-primary:hover {
        background: #3182ce;
      }
      
      /* Affiliate links grid inside monetization section */
      .affiliate-links.monetization-section {
        display: block !important;
      }
      
      .affiliate-links .affiliate-link {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        text-decoration: none;
        color: #2d3748;
        transition: all 0.3s ease;
        display: block;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
      }
      
      .affiliate-links .affiliate-link:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      .affiliate-links .affiliate-link img {
        width: 100%;
        max-width: 200px;
        height: 120px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 1rem;
      }
      
      input[type="email"] {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 0.75rem;
        color: #2d3748;
        width: 100%;
        max-width: 300px;
        margin: 0.5rem auto;
        display: block;
      }
      
      /* Product grid should be grid but inside its container */
      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      
      .product-card {
        background: #f7fafc;
        color: #2d3748;
        border-radius: 8px;
        padding: 1rem;
        text-align: center;
        border: 1px solid #e2e8f0;
      }
      
      /* Testimonials grid should be grid but inside its container */
      .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      
      .testimonial-card {
        background: #f7fafc;
        color: #2d3748;
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid #e2e8f0;
      }
      
      .rating {
        color: #ffd700;
      }
      
      /* Mobile Responsiveness */
      @media (max-width: 768px) {
        body {
          padding: 1rem;
        }
        
        .monetization-features-container {
          padding: 0 0.5rem;
        }
        
        .monetization-section,
        .lead-magnet, 
        .sponsored-content, 
        .donation-button, 
        .newsletter-signup,
        .product-showcase, 
        .social-proof, 
        .exit-intent, 
        .email-collection,
        .content-lock, 
        .countdown-offer, 
        .affiliate-links {
          padding: 1.25rem;
          margin: 1.5rem auto;
        }
        
        .btn-primary {
          width: 100%;
          max-width: 250px;
          padding: 0.7rem 1.25rem;
        }
        
        .social-icons {
          gap: 0.25rem;
        }
        
        .product-grid {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        
        .testimonials-grid {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        
        input[type="email"] {
          max-width: 100%;
          margin: 0.5rem 0;
        }
      }
      
      @media (max-width: 480px) {
        body {
          padding: 0.5rem;
        }
        
        .monetization-section,
        .lead-magnet, 
        .sponsored-content, 
        .donation-button, 
        .newsletter-signup,
        .product-showcase, 
        .social-proof, 
        .exit-intent, 
        .email-collection,
        .content-lock, 
        .countdown-offer, 
        .affiliate-links {
          padding: 1rem;
          margin: 1rem auto;
        }
      }
    `,
    
    creative: `
      body {
        margin: 0;
        padding: 0;
        min-height: 100vh;
        background: #1a1a1a;
        color: #fff;
        position: relative;
        overflow-x: hidden;
        font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .background-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: 
          radial-gradient(circle at 20% 50%, #ff00ff 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, #00ffff 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, #ffff00 0%, transparent 50%);
        opacity: 0.1;
        animation: colorShift 10s ease-in-out infinite;
      }
      
      @keyframes colorShift {
        0%, 100% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(180deg); }
      }
      
      .container {
        text-align: center;
        z-index: 2;
        position: relative;
        max-width: 900px;
        padding: 2rem;
        width: 100%;
        margin: 0 auto;
      }
      
      .error-code {
        font-size: clamp(8rem, 15vw, 12rem);
        font-weight: 900;
        margin: 0;
        background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        background-size: 300% 300%;
        animation: gradientShift 3s ease infinite;
      }
      
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      .title {
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        margin: 1rem 0;
        font-weight: 700;
        text-shadow: 0 0 20px rgba(255,255,255,0.5);
      }
      
      .description {
        font-size: clamp(1rem, 2.5vw, 1.25rem);
        margin: 1.5rem 0 2rem;
        opacity: 0.9;
        line-height: 1.6;
      }
      
      .social-icons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 2rem 0;
        flex-wrap: wrap;
      }
      
      .social-icon {
        display: inline-flex;
        align-items: center;
        padding: 0.75rem 1.25rem;
        background: linear-gradient(45deg, #ff00ff, #00ffff);
        border-radius: 25px;
        color: white;
        text-decoration: none;
        transition: all 0.3s ease;
        font-weight: 600;
        position: relative;
        overflow: hidden;
      }
      
      .social-icon::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      
      .social-icon:hover::before {
        left: 100%;
      }
      
      .social-icon:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 10px 30px rgba(255,0,255,0.3);
      }
      
      /* Monetization sections - FORCE vertical stacking with mobile responsiveness */
      .monetization-features-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .monetization-section,
      .lead-magnet, 
      .sponsored-content, 
      .donation-button, 
      .newsletter-signup,
      .product-showcase, 
      .social-proof, 
      .exit-intent, 
      .email-collection,
      .content-lock, 
      .countdown-offer, 
      .affiliate-links {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 2rem;
        margin: 2rem auto;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        width: 100%;
        max-width: 800px;
        display: block !important;
        float: none !important;
        clear: both !important;
        position: relative !important;
      }
      
      .btn-primary {
        background: linear-gradient(45deg, #ff00ff, #00ffff);
        border: none;
        padding: 1rem 2rem;
        border-radius: 25px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        min-width: 120px;
        text-align: center;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      
      .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      
      .btn-primary:hover::before {
        left: 100%;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(255,0,255,0.4);
      }
      
      /* Affiliate links grid inside monetization section */
      .affiliate-links.monetization-section {
        display: block !important;
      }
      
      .affiliate-links .affiliate-link {
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        padding: 1.5rem;
        text-decoration: none;
        color: #333;
        transition: all 0.3s ease;
        display: block;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
      }
      
      .affiliate-links .affiliate-link:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
      }
      
      .affiliate-links .affiliate-link img {
        width: 100%;
        max-width: 200px;
        height: 120px;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 1rem;
      }
      
      input[type="email"] {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 15px;
        padding: 0.75rem 1rem;
        color: white;
        width: 100%;
        max-width: 300px;
        margin: 0.5rem auto;
        backdrop-filter: blur(10px);
        display: block;
      }
      
      input[type="email"]::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
      
      /* Product grid should be grid but inside its container */
      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      
      .product-card {
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        border-radius: 15px;
        padding: 1rem;
        text-align: center;
      }
      
      /* Testimonials grid should be grid but inside its container */
      .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      
      .testimonial-card {
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        border-radius: 15px;
        padding: 1rem;
      }
      
      .rating {
        color: #ffd700;
      }
      
      /* Mobile Responsiveness */
      @media (max-width: 768px) {
        .container {
          padding: 1rem;
        }
        
        .monetization-features-container {
          padding: 0 0.5rem;
        }
        
        .monetization-section,
        .lead-magnet, 
        .sponsored-content, 
        .donation-button, 
        .newsletter-signup,
        .product-showcase, 
        .social-proof, 
        .exit-intent, 
        .email-collection,
        .content-lock, 
        .countdown-offer, 
        .affiliate-links {
          padding: 1.5rem;
          margin: 1.5rem auto;
        }
        
        .btn-primary {
          width: 100%;
          max-width: 250px;
          padding: 0.8rem 1.5rem;
        }
        
        .social-icons {
          gap: 0.5rem;
        }
        
        .social-icon {
          padding: 0.6rem 1rem;
          font-size: 0.85rem;
        }
        
        .product-grid {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        
        .testimonials-grid {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        
        input[type="email"] {
          max-width: 100%;
          margin: 0.5rem 0;
        }
      }
      
      @media (max-width: 480px) {
        .container {
          padding: 0.75rem;
        }
        
        .monetization-section,
        .lead-magnet, 
        .sponsored-content, 
        .donation-button, 
        .newsletter-signup,
        .product-showcase, 
        .social-proof, 
        .exit-intent, 
        .email-collection,
        .content-lock, 
        .countdown-offer, 
        .affiliate-links {
          padding: 1rem;
          margin: 1rem auto;
        }
        
        .btn-primary {
          padding: 0.7rem 1.25rem;
          font-size: 0.9rem;
        }
      }
    `,
    
    professional: `
      body {
        margin: 0;
        padding: 2rem;
        min-height: 100vh;
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        color: white;
        font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      
      .container {
        text-align: center;
        max-width: 900px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 3rem 2rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        width: 100%;
        margin: 0 auto;
      }
      
      .error-code {
        font-size: clamp(5rem, 10vw, 8rem);
        font-weight: 600;
        margin: 0;
        color: #fff;
        letter-spacing: -0.02em;
      }
      
      .title {
        font-size: clamp(1.5rem, 3.5vw, 2.25rem);
        margin: 1rem 0;
        font-weight: 600;
        color: #fff;
      }
      
      .description {
        font-size: clamp(1rem, 2.5vw, 1.125rem);
        margin: 1.5rem 0 2rem;
        opacity: 0.9;
        line-height: 1.6;
      }
      
      .social-icons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin: 2rem 0;
        flex-wrap: wrap;
      }
      
      .social-icon {
        display: inline-flex;
        align-items: center;
        padding: 0.75rem 1.25rem;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: 10px;
        color: white;
        text-decoration: none;
        transition: all 0.3s ease;
        font-weight: 500;
      }
      
      .social-icon:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
      }
      
      /* Monetization sections - FORCE vertical stacking with mobile responsiveness */
      .monetization-features-container {
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      .monetization-section,
      .lead-magnet, 
      .sponsored-content, 
      .donation-button, 
      .newsletter-signup,
      .product-showcase, 
      .social-proof, 
      .exit-intent, 
      .email-collection,
      .content-lock, 
      .countdown-offer, 
      .affiliate-links {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        padding: 2rem;
        margin: 2rem auto;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 800px;
        display: block !important;
        float: none !important;
        clear: both !important;
        position: relative !important;
      }
      
      .btn-primary {
        background: linear-gradient(45deg, #4299e1, #3182ce);
        border: none;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(66, 153, 225, 0.4);
        min-width: 120px;
        text-align: center;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(66, 153, 225, 0.6);
      }
      
      /* Affiliate links grid inside monetization section */
      .affiliate-links.monetization-section {
        display: block !important;
      }
      
      .affiliate-links .affiliate-link {
        background: rgba(255, 255, 255, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 15px;
        padding: 1.5rem;
        text-decoration: none;
        color: #333;
        transition: all 0.3s ease;
        display: block;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
      }
      
      .affiliate-links .affiliate-link:hover {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
      }
      
      .affiliate-links .affiliate-link img {
        width: 100%;
        max-width: 200px;
        height: 120px;
        object-fit: cover;
        border-radius: 10px;
        margin-bottom: 1rem;
      }
      
      input[type="email"] {
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 10px;
        padding: 0.75rem 1rem;
        color: white;
        width: 100%;
        max-width: 300px;
        margin: 0.5rem auto;
        backdrop-filter: blur(10px);
        display: block;
      }
      
      input[type="email"]::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }
      
      /* Product grid should be grid but inside its container */
      .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      
      .product-card {
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        border-radius: 12px;
        padding: 1rem;
        text-align: center;
      }
      
      /* Testimonials grid should be grid but inside its container */
      .testimonials-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      }
      
      .testimonial-card {
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        border-radius: 12px;
        padding: 1rem;
      }
      
      .rating {
        color: #ffd700;
      }
      
      /* Mobile Responsiveness */
      @media (max-width: 768px) {
        body {
          padding: 1rem;
        }
        
        .container {
          padding: 2rem 1.5rem;
        }
        
        .monetization-features-container {
          padding: 0 0.5rem;
        }
        
        .monetization-section,
        .lead-magnet, 
        .sponsored-content, 
        .donation-button, 
        .newsletter-signup,
        .product-showcase, 
        .social-proof, 
        .exit-intent, 
        .email-collection,
        .content-lock, 
        .countdown-offer, 
        .affiliate-links {
          padding: 1.5rem;
          margin: 1.5rem auto;
        }
        
        .btn-primary {
          width: 100%;
          max-width: 250px;
          padding: 0.8rem 1.5rem;
        }
        
        .social-icons {
          gap: 0.5rem;
        }
        
        .social-icon {
          padding: 0.6rem 1rem;
          font-size: 0.85rem;
        }
        
        .product-grid {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        
        .testimonials-grid {
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }
        
        input[type="email"] {
          max-width: 100%;
          margin: 0.5rem 0;
        }
      }
      
      @media (max-width: 480px) {
        body {
          padding: 0.5rem;
        }
        
        .container {
          padding: 1.5rem 1rem;
        }
        
        .monetization-section,
        .lead-magnet, 
        .sponsored-content, 
        .donation-button, 
        .newsletter-signup,
        .product-showcase, 
        .social-proof, 
        .exit-intent, 
        .email-collection,
        .content-lock, 
        .countdown-offer, 
        .affiliate-links {
          padding: 1rem;
          margin: 1rem auto;
        }
        
        .btn-primary {
          padding: 0.7rem 1.25rem;
          font-size: 0.9rem;
        }
      }
    `
  };

  return themes[theme];
};

export function getDefaultPageStructure(page: any): string {
  const socialIcons = Object.entries(page.socialLinks || {})
    .filter(([_, url]) => url)
    .map(([platform, url]) => `
      <a href="${url}" target="_blank" rel="noopener noreferrer" class="social-icon ${platform}" style="background-color: ${getSocialColor(platform)};">
        <i data-feather="${platform}"></i>
        <span>${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
      </a>
    `).join('');

  return `
    <div class="container">
      <div class="main-content">
        <div class="error-code">404</div>
        <h1 class="error-title">${page.title || 'Page Not Found'}</h1>
        <p class="error-description">${page.description || 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'}</p>
        
        ${socialIcons ? `
          <div class="social-icons">
            ${socialIcons}
          </div>
        ` : ''}
        
        <div class="action-buttons">
          <button class="btn-primary" onclick="window.history.back()">
            <i data-feather="arrow-left"></i>
            Go Back
          </button>
          <button class="btn-primary" onclick="window.location.href='/'">
            <i data-feather="home"></i>
            Home Page
          </button>
        </div>
      </div>
      
      <div class="monetization-features-container">
        <!-- Monetization features will be inserted here -->
      </div>
    </div>
  `;
}

function getSocialColor(platform: string): string {
  const colors: Record<string, string> = {
    facebook: '#1877F2',
    twitter: '#000000',
    instagram: '#E4405F',
    linkedin: '#0A66C2',
    youtube: '#FF0000',
    website: '#6B7280'
  };
  return colors[platform] || '#6B7280';
} 