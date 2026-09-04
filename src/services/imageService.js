import axios from 'axios';

export const imageService = {
  async generateImage(prompt, options = {}) {
    const { model = 'flux', width = 1024, height = 1024, seed } = options;
    try {
      const response = await axios.post('/api/generate-image', {
        prompt,
        model,
        width,
        height,
        seed
      });
      return response.data;
    } catch (error) {
      // Direct client fallback to Pollinations if server has issue
      const randomSeed = seed || Math.floor(Math.random() * 1000000);
      const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.trim())}?width=${width}&height=${height}&model=${model}&seed=${randomSeed}&nologo=true`;
      return {
        success: true,
        url,
        prompt,
        model,
        seed: randomSeed
      };
    }
  },

  enhancePrompt(prompt, style = 'photorealistic') {
    const enhancers = {
      cyberpunk: 'cyberpunk aesthetic, vibrant neon glow, hyper-detailed obsidian surfaces, cinematic lighting, 8k resolution, raytracing',
      photorealistic: 'hyper-realistic photography, 35mm lens, depth of field, natural lighting, high dynamic range, masterwork',
      anime: 'masterpiece anime key visual, Makoto Shinkai aesthetic, intricate details, vivid atmospheric lighting',
      minimalist: 'minimalist brutalist composition, clean geometric lines, high contrast, sleek matte finish'
    };
    const addition = enhancers[style] || enhancers.cyberpunk;
    return `${prompt.trim()}, ${addition}`;
  }
};
