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
}

const allGenres = {
  'Lo-fi / Jazz': [
    { title: 'Coffee Shop Vibes', artist: 'Nujabes', youtubeUrl: 'https://www.youtube.com/watch?v=2sML2bq_WGw' },
    { title: 'Take Five', artist: 'Dave Brubeck', youtubeUrl: 'https://www.youtube.com/watch?v=vmDDOFXSgAs' },
    { title: 'Autumn Leaves', artist: 'Bill Evans', youtubeUrl: 'https://www.youtube.com/watch?v=r-Z8KuwI7Gc' },
    { title: 'So What', artist: 'Miles Davis', youtubeUrl: 'https://www.youtube.com/watch?v=zqNTltOGh5c' }
  ],
  'Pop / Rock': [
    { title: 'Blinding Lights', artist: 'The Weeknd', youtubeUrl: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ' },
    { title: 'Heat Waves', artist: 'Glass Animals', youtubeUrl: 'https://www.youtube.com/watch?v=mRD0-GxqHVo' },
    { title: 'As It Was', artist: 'Harry Styles', youtubeUrl: 'https://www.youtube.com/watch?v=H5v3kku4y6Q' },
    { title: 'Stay With Me', artist: 'Calvin Harris', youtubeUrl: 'https://www.youtube.com/watch?v=CID-sYQNCew' }
  ],
  'Soul / R&B': [
    { title: 'Leave The Door Open', artist: 'Silk Sonic', youtubeUrl: 'https://www.youtube.com/watch?v=adLGHcj_fmA' },
    { title: 'Stay With Me', artist: 'Sam Smith', youtubeUrl: 'https://www.youtube.com/watch?v=pB-5XG-DbAA' },
    { title: 'Easy On Me', artist: 'Adele', youtubeUrl: 'https://www.youtube.com/watch?v=U3ASj1L6_sY' },
    { title: 'Save Your Tears', artist: 'The Weeknd', youtubeUrl: 'https://www.youtube.com/watch?v=XXYlFuWEuKI' }
  ],
  'Ambient / Electronic': [
    { title: 'Strobe', artist: 'Deadmau5', youtubeUrl: 'https://www.youtube.com/watch?v=tKi9Z-f6qX4' },
    { title: 'Midnight City', artist: 'M83', youtubeUrl: 'https://www.youtube.com/watch?v=dX3k_QDnzHE' },
    { title: 'Get Lucky', artist: 'Daft Punk', youtubeUrl: 'https://www.youtube.com/watch?v=5NV6Rdv1a3I' },
    { title: 'Faded', artist: 'Alan Walker', youtubeUrl: 'https://www.youtube.com/watch?v=60ItHLz5WEA' }
  ],
  'Rainy Day': [
    { title: 'Riders on the Storm', artist: 'The Doors', youtubeUrl: 'https://www.youtube.com/watch?v=7G2-FPlvY58' },
    { title: 'Set Fire to the Rain', artist: 'Adele', youtubeUrl: 'https://www.youtube.com/watch?v=FlsBObg-1BQ' },
    { title: 'Purple Rain', artist: 'Prince', youtubeUrl: 'https://www.youtube.com/watch?v=TvnYmWpD_T8' },
    { title: 'November Rain', artist: 'Guns N\' Roses', youtubeUrl: 'https://www.youtube.com/watch?v=8SbUC-UaAxE' }
  ],
  'Hip Hop': [
    { title: 'God\'s Plan', artist: 'Drake', youtubeUrl: 'https://www.youtube.com/watch?v=xpVfcZ0ZcFM' },
    { title: 'Sicko Mode', artist: 'Travis Scott', youtubeUrl: 'https://www.youtube.com/watch?v=6ONRf7h3Mdk' },
    { title: 'Industry Baby', artist: 'Lil Nas X', youtubeUrl: 'https://www.youtube.com/watch?v=UTHLKHL_whs' },
    { title: 'Humble', artist: 'Kendrick Lamar', youtubeUrl: 'https://www.youtube.com/watch?v=tvTRZJ-4EyI' }
  ]
};

const popularSongs = allGenres;

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
      description: `Perfect rainy day music to match the ${weather} weather. Temperature: ${temp}°C`,
      songs: popularSongs['Rainy Day']
    };
  }

  if (hour >= 5 && hour < 12) {
    return {
      genre: "Lo-fi / Jazz",
      mood: `Energizing & Calm (${season})`,
      description: `Start your ${season} day with gentle beats and smooth melodies. Temperature: ${temp}°C`,
      songs: popularSongs['Lo-fi / Jazz']
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      genre: "Pop / Rock",
      mood: `Upbeat & Dynamic (${season})`,
      description: `Keep your energy high with upbeat tunes perfect for the ${season} afternoon. Temperature: ${temp}°C`,
      songs: popularSongs['Pop / Rock']
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      genre: "Soul / R&B",
      mood: `Relaxing & Smooth (${season})`,
      description: `Wind down with soulful melodies as the ${season} day comes to a close. Temperature: ${temp}°C`,
      songs: popularSongs['Soul / R&B']
    };
  } else {
    return {
      genre: "Ambient / Electronic",
      mood: `Peaceful & Atmospheric (${season})`,
      description: `Perfect for late ${season} night focus or relaxation. Temperature: ${temp}°C`,
      songs: popularSongs['Ambient / Electronic']
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
                <h1 className="text-2xl font-bold">Time-Based Music</h1>
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
                  {selectedGenre ? `Top ${selectedGenre} Tracks` : 'Recommended Tracks'}
                </h3>
                {(selectedGenre ? allGenres[selectedGenre] : suggestion.songs).map((song, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
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
                ))}
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6">
                <h3 className="font-semibold mb-2">Why this recommendation?</h3>
                <p className="text-sm">
                  Our suggestions adapt to the natural rhythm of your day, current weather conditions, 
                  and seasonal changes to provide the perfect soundtrack for your activities.
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