import React, { useState, useEffect } from 'react';
import { Clock, Music, Sun, Moon, Sunset, Thermometer, CloudRain, Youtube } from 'lucide-react';

interface WeatherData {
  temp: number;
  weather: string;
}

interface MusicSuggestion {
  genre: string;
  mood: string;
  description: string;
  songs: Song[];
}

interface Song {
  title: string;
  artist: string;
  youtubeUrl: string;
  acclaim?: string;
}

const allGenres = {
  'Lo-fi / Jazz': [
    { title: 'Take Five', artist: 'Dave Brubeck', youtubeUrl: 'https://www.youtube.com/watch?v=vmDDOFXSgAs', acclaim: 'Landmark jazz composition with unusual 5/4 time signature' },
    { title: 'Autumn Leaves', artist: 'Bill Evans', youtubeUrl: 'https://www.youtube.com/watch?v=r-Z8KuwI7Gc', acclaim: 'Considered one of the finest piano jazz recordings ever made' },
    { title: 'So What', artist: 'Miles Davis', youtubeUrl: 'https://www.youtube.com/watch?v=zqNTltOGh5c', acclaim: 'From the landmark album "Kind of Blue", revolutionary modal jazz' },
    { title: 'My Favorite Things', artist: 'John Coltrane', youtubeUrl: 'https://www.youtube.com/watch?v=qWG2dsXV5HI', acclaim: 'Masterful jazz interpretation of the Broadway classic' }
  ],
  'Pop / Rock': [
    { title: 'Bohemian Rhapsody', artist: 'Queen', youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', acclaim: 'Groundbreaking rock opera section that changed popular music' },
    { title: 'Like a Rolling Stone', artist: 'Bob Dylan', youtubeUrl: 'https://www.youtube.com/watch?v=IwOfCgkyEj0', acclaim: 'Revolutionary rock song with profound lyrical depth' },
    { title: 'God Only Knows', artist: 'The Beach Boys', youtubeUrl: 'https://www.youtube.com/watch?v=CWPo5SC3zik', acclaim: 'Paul McCartney\'s favorite song, masterpiece of arrangement' },
    { title: 'Strawberry Fields Forever', artist: 'The Beatles', youtubeUrl: 'https://www.youtube.com/watch?v=HtUH9z_Oey8', acclaim: 'Innovative production techniques and composition' }
  ],
  'Soul / R&B': [
    { title: 'Respect', artist: 'Aretha Franklin', youtubeUrl: 'https://www.youtube.com/watch?v=6FOUqQt3Kg0', acclaim: 'Defining anthem of the genre and feminist movement' },
    { title: 'What\'s Going On', artist: 'Marvin Gaye', youtubeUrl: 'https://www.youtube.com/watch?v=H-kA3UtBj4M', acclaim: 'Revolutionary concept album addressing social issues' },
    { title: 'A Change Is Gonna Come', artist: 'Sam Cooke', youtubeUrl: 'https://www.youtube.com/watch?v=wEBlaMOmKV4', acclaim: 'Powerful civil rights anthem with timeless message' },
    { title: 'Superstition', artist: 'Stevie Wonder', youtubeUrl: 'https://www.youtube.com/watch?v=0CFuCYNx-1g', acclaim: 'Innovative funk masterpiece with intricate arrangements' }
  ],
  'Ambient / Electronic': [
    { title: 'Music for Airports', artist: 'Brian Eno', youtubeUrl: 'https://www.youtube.com/watch?v=vNwYtllyt3Q', acclaim: 'Pioneering ambient music that defined the genre' },
    { title: 'Oxygène', artist: 'Jean-Michel Jarre', youtubeUrl: 'https://www.youtube.com/watch?v=5DDEl7JnWvo', acclaim: 'Breakthrough electronic album with innovative synthesizer work' },
    { title: 'Selected Ambient Works 85-92', artist: 'Aphex Twin', youtubeUrl: 'https://www.youtube.com/watch?v=Xw5AiRVqfqk', acclaim: 'Influential electronic music that blends ambient with techno' },
    { title: 'Untrue', artist: 'Burial', youtubeUrl: 'https://www.youtube.com/watch?v=8k_f2QK77ew', acclaim: 'Revolutionary dubstep album with emotional depth' }
  ],
  'Rainy Day': [
    { title: 'Riders on the Storm', artist: 'The Doors', youtubeUrl: 'https://www.youtube.com/watch?v=7G2-FPlvY58', acclaim: 'Atmospheric classic with real rain sounds' },
    { title: 'Both Sides Now', artist: 'Joni Mitchell', youtubeUrl: 'https://www.youtube.com/watch?v=Pbn6a0AFfnM', acclaim: 'Poetic masterpiece of introspection' },
    { title: 'Rainy Night in Georgia', artist: 'Brook Benton', youtubeUrl: 'https://www.youtube.com/watch?v=bDRbF80NKDU', acclaim: 'Soul classic perfect for rainy contemplation' },
    { title: 'Shelter from the Storm', artist: 'Bob Dylan', youtubeUrl: 'https://www.youtube.com/watch?v=-gsDBuHwqbM', acclaim: 'Profound lyrics with timeless appeal' }
  ],
  'Hip Hop': [
    { title: 'N.Y. State of Mind', artist: 'Nas', youtubeUrl: 'https://www.youtube.com/watch?v=hI8A14Qcv68', acclaim: 'Masterful storytelling from landmark album "Illmatic"' },
    { title: 'Nuthin\' but a \'G\' Thang', artist: 'Dr. Dre ft. Snoop Dogg', youtubeUrl: 'https://www.youtube.com/watch?v=6xjRdBjmePQ', acclaim: 'Defining West Coast G-funk classic' },
    { title: 'Juicy', artist: 'The Notorious B.I.G.', youtubeUrl: 'https://www.youtube.com/watch?v=_JZom_gVfuw', acclaim: 'Iconic rags-to-riches story with perfect flow' },
    { title: 'Alright', artist: 'Kendrick Lamar', youtubeUrl: 'https://www.youtube.com/watch?v=Z-48u_uWMHY', acclaim: 'Modern classic that became a social justice anthem' }
  ],
  'Classical': [
    { title: 'Clair de Lune', artist: 'Claude Debussy', youtubeUrl: 'https://www.youtube.com/watch?v=WNcsUNKlAKw', acclaim: 'Impressionist masterpiece of delicate beauty' },
    { title: 'Symphony No. 9 (Ode to Joy)', artist: 'Ludwig van Beethoven', youtubeUrl: 'https://www.youtube.com/watch?v=t3217H8JppI', acclaim: 'Revolutionary symphony composed while deaf' },
    { title: 'The Four Seasons', artist: 'Antonio Vivaldi', youtubeUrl: 'https://www.youtube.com/watch?v=GRxofEmo3HA', acclaim: 'Baroque masterpiece depicting nature in music' },
    { title: 'Gymnopédie No. 1', artist: 'Erik Satie', youtubeUrl: 'https://www.youtube.com/watch?v=S-Xm7s9eGxU', acclaim: 'Minimalist composition of profound simplicity' }
  ],
  'Folk / Acoustic': [
    { title: 'The Times They Are a-Changin\'', artist: 'Bob Dylan', youtubeUrl: 'https://www.youtube.com/watch?v=90WD_ats6eE', acclaim: 'Protest song that defined a generation' },
    { title: 'Both Sides, Now', artist: 'Joni Mitchell', youtubeUrl: 'https://www.youtube.com/watch?v=Pbn6a0AFfnM', acclaim: 'Poetic masterpiece of lyrical depth' },
    { title: 'Sound of Silence', artist: 'Simon & Garfunkel', youtubeUrl: 'https://www.youtube.com/watch?v=NAEppFUWLfc', acclaim: 'Haunting folk classic with timeless message' },
    { title: 'I See Fire', artist: 'Ed Sheeran', youtubeUrl: 'https://www.youtube.com/watch?v=2fngvQS_PmQ', acclaim: 'Modern folk masterpiece with cinematic quality' }
  ],
  'Blues': [
    { title: 'Crossroad Blues', artist: 'Robert Johnson', youtubeUrl: 'https://www.youtube.com/watch?v=Yd60nI4sa9A', acclaim: 'Pioneering Delta blues with legendary status' },
    { title: 'The Thrill Is Gone', artist: 'B.B. King', youtubeUrl: 'https://www.youtube.com/watch?v=oica5jG7FpU', acclaim: 'Signature song of the King of Blues' },
    { title: 'Stormy Monday', artist: 'T-Bone Walker', youtubeUrl: 'https://www.youtube.com/watch?v=hVR8lg1YLuc', acclaim: 'Influential electric blues that inspired generations' },
    { title: 'I\'d Rather Go Blind', artist: 'Etta James', youtubeUrl: 'https://www.youtube.com/watch?v=u9sq3ME0JHQ', acclaim: 'Soulful blues with raw emotional power' }
  ],
  'World Music': [
    { title: 'Yamore', artist: 'Salif Keita', youtubeUrl: 'https://www.youtube.com/watch?v=R3jAZJ-xpHI', acclaim: 'Celebrated fusion of African traditions with modern sounds' },
    { title: 'Chan Chan', artist: 'Buena Vista Social Club', youtubeUrl: 'https://www.youtube.com/watch?v=KODWcrncnm8', acclaim: 'Cuban classic that revived interest in the genre worldwide' },
    { title: 'Djam Leelii', artist: 'Baaba Maal & Mansour Seck', youtubeUrl: 'https://www.youtube.com/watch?v=yUrU5OS1i6Y', acclaim: 'Senegalese masterpiece of vocal and string virtuosity' },
    { title: 'Dil Se Re', artist: 'A.R. Rahman', youtubeUrl: 'https://www.youtube.com/watch?v=YwfCMvo19s8', acclaim: 'Groundbreaking Indian film music with global appeal' }
  ]
};

const criticallyAcclaimedSongs = allGenres;

function getMockWeather(): WeatherData {
  const hour = new Date().getHours();
  const baseTemp = 20;
  const hourlyVariation = Math.sin((hour / 24) * 2 * Math.PI) * 5;
  const randomVariation = Math.random() * 2 - 1;
  
  const temp = baseTemp + hourlyVariation + randomVariation;
  
  const weatherTypes = ['Clear', 'Rain', 'Clouds'];
  const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
  
  return {
    temp: Math.round(temp * 10) / 10,
    weather: weather
  };
}

function getSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Fall';
  return 'Winter';
}

function getTimeBasedSuggestion(weatherData: WeatherData | null): MusicSuggestion {
  const hour = new Date().getHours();
  const season = getSeason();
  const temp = weatherData?.temp || 20;
  const weather = weatherData?.weather || 'clear';

  if (weather.toLowerCase().includes('rain')) {
    return {
      genre: "Rainy Day",
      mood: "Contemplative & Cozy",
      description: `Perfect rainy day music to match the ${weather} weather. These tracks are considered masterpieces of the genre. Temperature: ${temp}°C`,
      songs: criticallyAcclaimedSongs['Rainy Day']
    };
  }

  // Early morning (5-9)
  if (hour >= 5 && hour < 9) {
    return {
      genre: "Classical",
      mood: `Peaceful Awakening (${season})`,
      description: `Start your ${season} day with gentle classical pieces that are universally acclaimed. Temperature: ${temp}°C`,
      songs: criticallyAcclaimedSongs['Classical']
    };
  } 
  // Late morning (9-12)
  else if (hour >= 9 && hour < 12) {
    return {
      genre: "Lo-fi / Jazz",
      mood: `Focused & Inspired (${season})`,
      description: `Perfect ${season} morning music with critically acclaimed jazz recordings that have stood the test of time. Temperature: ${temp}°C`,
      songs: criticallyAcclaimedSongs['Lo-fi / Jazz']
    };
  } 
  // Early afternoon (12-15)
  else if (hour >= 12 && hour < 15) {
    return {
      genre: "Pop / Rock",
      mood: `Energetic & Thoughtful (${season})`,
      description: `Keep your ${season} afternoon productive with these rock masterpieces that changed music history. Temperature: ${temp}°C`,
      songs: criticallyAcclaimedSongs['Pop / Rock']
    };
  } 
  // Late afternoon (15-18)
  else if (hour >= 15 && hour < 18) {
    return {
      genre: "Folk / Acoustic",
      mood: `Reflective & Mellow (${season})`,
      description: `Wind down your ${season} workday with these acoustic classics that feature exceptional songwriting. Temperature: ${temp}°C`,
      songs: criticallyAcclaimedSongs['Folk / Acoustic']
    };
  } 
  // Evening (18-21)
  else if (hour >= 18 && hour < 21) {
    return {
      genre: "Soul / R&B",
      mood: `Relaxing & Soulful (${season})`,
      description: `These soul masterpieces provide the perfect soundtrack for your ${season} evening. Temperature: ${temp}°C`,
      songs: criticallyAcclaimedSongs['Soul / R&B']
    };
  } 
  // Night (21-24)
  else if (hour >= 21 && hour < 24) {
    return {
      genre: "Ambient / Electronic",
      mood: `Atmospheric & Introspective (${season})`,
      description: `Late ${season} night music featuring groundbreaking electronic compositions perfect for deep listening. Temperature: ${temp}°C`,
      songs: criticallyAcclaimedSongs['Ambient / Electronic']
    };
  } 
  // Late night (0-5)
  else {
    return {
      genre: "Blues",
      mood: `Deep & Contemplative (${season})`,
      description: `Late night ${season} blues classics from the masters of the genre. Temperature: ${temp}°C`,
      songs: criticallyAcclaimedSongs['Blues']
    };
  }
}

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [suggestion, setSuggestion] = useState<MusicSuggestion>(getTimeBasedSuggestion(null));
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  useEffect(() => {
    const updateWeather = () => {
      const mockWeather = getMockWeather();
      setWeatherData(mockWeather);
      setSuggestion(getTimeBasedSuggestion(mockWeather));
    };

    updateWeather();

    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateWeather();
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getTimeIcon = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (hour >= 12 && hour < 17) return <Sun className="w-8 h-8 text-orange-500" />;
    if (hour >= 17 && hour < 21) return <Sunset className="w-8 h-8 text-pink-500" />;
    return <Moon className="w-8 h-8 text-blue-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 backdrop-blur-lg bg-opacity-50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Music className="w-8 h-8 text-purple-500" />
                <h1 className="text-2xl font-bold">Curated Music Recommendations</h1>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6" />
                <span className="text-xl">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getTimeIcon()}
                  <div>
                    <h2 className="text-xl font-semibold">Current Mood</h2>
                    <p className="text-gray-300">{suggestion.mood}</p>
                  </div>
                </div>
                {weatherData && (
                  <div className="flex items-center space-x-3">
                    <Thermometer className="w-6 h-6 text-red-400" />
                    <span>{Math.round(weatherData.temp)}°C</span>
                    {weatherData.weather.toLowerCase().includes('rain') && (
                      <CloudRain className="w-6 h-6 text-blue-400" />
                    )}
                  </div>
                )}
              </div>

              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2">Recommended Genre</h3>
                <p className="text-2xl font-bold text-purple-400 mb-4">{suggestion.genre}</p>
                <p className="text-gray-300">{suggestion.description}</p>
              </div>

              {/* Genre Selection */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Explore Other Genres</h3>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                >
                  <option value="">Select a genre</option>
                  {Object.keys(allGenres).map((genre) => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {selectedGenre ? `Acclaimed ${selectedGenre} Masterpieces` : 'Recommended Tracks'}
                </h3>
                {(selectedGenre ? allGenres[selectedGenre] : suggestion.songs).map((song, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{song.title}</p>
                        <p className="text-sm text-gray-400">{song.artist}</p>
                      </div>
                      <a
                        href={song.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        <Youtube className="w-6 h-6" />
                      </a>
                    </div>
                    {song.acclaim && (
                      <p className="text-xs text-gray-400 italic border-t border-gray-600 pt-2 mt-1">
                        {song.acclaim}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Why these recommendations?</h3>
                <p className="text-sm">
                  Our curated selections highlight critically acclaimed masterpieces that represent the best of each genre,
                  not just the most streamed songs. These recommendations adapt to the time of day, weather conditions, 
                  and seasonal changes to provide the perfect soundtrack for your mood and activities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;