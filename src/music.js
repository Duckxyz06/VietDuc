// Background recording supplied by the website owner.
// MUSIC-LICENSE.txt applies only to the previous synthesized score, not this file.
export function createMusic(){const audio=new Audio(`${import.meta.env.BASE_URL}audio/background.m4a`);audio.loop=true;audio.volume=.35;audio.preload='none';let playing=false;
return {get playing(){return playing},async toggle(){if(playing){audio.pause();playing=false;return false;}await audio.play();playing=true;return true;},async hide(){audio.pause()},async show(){if(playing)await audio.play()}};}
