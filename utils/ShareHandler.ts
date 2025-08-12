// ShareHandler.js
import * as Linking from 'expo-linking';
import { Alert, AppState } from 'react-native';

class ShareHandler {
  constructor() {
    this.setupLinkingListener();
    this.setupAppStateListener();
  }

  setupLinkingListener() {
    // Handle links when app is launched
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('Initial URL:', url);
        this.handleIncomingURL(url);
      }
    });

    // Handle links when app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Received URL:', url);
      this.handleIncomingURL(url);
    });

    return subscription;
  }

  setupAppStateListener() {
    // Handle app state changes to catch shared content
    AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // Check for shared content when app becomes active
        this.checkForSharedContent();
      }
    });
  }

  async checkForSharedContent() {
    // This is a workaround for Expo - check if there's shared data
    // You might need to use native modules for full share intent handling
    try {
      const initialURL = await Linking.getInitialURL();
      if (initialURL && this.isValidReelOrShortUrl(initialURL)) {
        this.handleSharedContent(initialURL);
      }
    } catch (error) {
      console.log('No shared content found');
    }
  }

  handleIncomingURL(url) {
    if (url.startsWith('clipsy://')) {
      // Handle your app's custom scheme
      this.parseCustomURL(url);
    } else if (this.isValidReelOrShortUrl(url)) {
      // Handle shared social media URLs
      this.handleSharedContent(url);
    }
  }

  parseCustomURL(url) {
    // Parse custom URL scheme: clipsy://share?url=ENCODED_URL
    try {
      const parsed = Linking.parse(url);
      if (parsed.path === 'share' && parsed.queryParams?.url) {
        const sharedUrl = decodeURIComponent(parsed.queryParams.url);
        if (this.isValidReelOrShortUrl(sharedUrl)) {
          this.handleSharedContent(sharedUrl);
        }
      }
    } catch (error) {
      console.error('Error parsing custom URL:', error);
    }
  }

  async handleSharedContent(url) {
    console.log('Processing shared content:', url);
    
    try {
      // Show loading indicator
      Alert.alert('Processing', 'Extracting content from shared link...');
      
      await this.sendToBackend(url);
      
    } catch (error) {
      console.error('Error handling shared content:', error);
      Alert.alert('Error', 'Failed to process shared content');
    }
  }

  extractUrlFromText(text) {
    // Regex to extract URLs from text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches ? matches[0] : null;
  }

  isValidReelOrShortUrl(url) {
    if (!url) return false;
    
    const validPatterns = [
      'instagram.com/reel',
      'instagram.com/p/',
      'instagram.com/tv/',
      'youtube.com/shorts',
      'youtu.be/',
      'youtube.com/watch',
      'tiktok.com/',
      'vm.tiktok.com/',
      'twitter.com/',
      'x.com/'
    ];

    return validPatterns.some(pattern => url.includes(pattern));
  }

  async sendToBackend(url) {
    try {
      const response = await fetch('https://yourapi.com/api/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your auth headers if needed
          // 'Authorization': 'Bearer your-token'
        },
        body: JSON.stringify({ 
          url,
          timestamp: new Date().toISOString(),
          source: 'mobile_share'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Backend response:', result);
      
      // Handle success
      Alert.alert(
        'Success!', 
        'Content extracted successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to results screen or update app state
              // NavigationService.navigate('ProcessedContent', { data: result });
            }
          }
        ]
      );
      
      return result;
      
    } catch (error) {
      console.error('Error sending to backend:', error);
      Alert.alert(
        'Error', 
        'Failed to extract content. Please try again.',
        [{ text: 'OK' }]
      );
      throw error;
    }
  }

  // Method to manually test the share functionality
  testShare(testUrl = 'https://www.instagram.com/reel/test123/') {
    this.handleSharedContent(testUrl);
  }
}

export default new ShareHandler();