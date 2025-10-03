import { Linking, Alert } from 'react-native';
import axios from 'axios';
import { store } from '@/store';

class ShareHandler {
  private static instance: ShareHandler;
  private linkingSubscription: any;

  private constructor() {}

  static getInstance(): ShareHandler {
    if (!ShareHandler.instance) {
      ShareHandler.instance = new ShareHandler();
    }
    return ShareHandler.instance;
  }

  static initialize() {
    const instance = ShareHandler.getInstance();
    instance.setupListeners();
  }

  static cleanup() {
    const instance = ShareHandler.getInstance();
    instance.removeListeners();
  }

  private setupListeners() {
    // Remove any existing subscription
    this.removeListeners();

    // Set up deep link listener for when app is already open
    this.linkingSubscription = Linking.addEventListener('url', this.handleIncomingURL);

    // Handle initial URL if app was opened via share
    Linking.getInitialURL().then(url => {
      if (url) {
        console.log('🚀 ShareHandler: Initial URL detected:', url);
        this.handleIncomingURL({ url });
      }
    });

    console.log('✅ ShareHandler: Listeners set up successfully');
  }

  private removeListeners() {
    if (this.linkingSubscription) {
      this.linkingSubscription.remove();
      this.linkingSubscription = null;
    }
  }

  private handleIncomingURL = async (event: { url: string }) => {
    console.log('📱 ShareHandler: Received URL:', event.url);
    
    try {
      // Check if it's a share intent
      if (event.url.includes('text=')) {
        // Decode the URL to get the shared text
        const decodedUrl = decodeURIComponent(event.url);
        const textMatch = decodedUrl.match(/text=(.+)/);
        
        if (textMatch && textMatch[1]) {
          const sharedText = textMatch[1];
          console.log('📝 ShareHandler: Extracted text:', sharedText);
          
          // Check if the shared text contains an Instagram URL
          const instagramUrlMatch = sharedText.match(/https?:\/\/(www\.)?instagram\.com\/[^\s]+/);
          
          if (instagramUrlMatch) {
            const instagramUrl = instagramUrlMatch[0];
            console.log('📸 ShareHandler: Found Instagram URL:', instagramUrl);
            
            // Send to backend
            await this.sendToBackend(instagramUrl);
          } else {
            console.log('⚠️ ShareHandler: No Instagram URL found in shared text');
          }
        }
      }
    } catch (error) {
      console.error('❌ ShareHandler: Error processing URL:', error);
    }
  };

  private async sendToBackend(url: string) {
    try {
      // Get current state from Redux store
      const state = store.getState();
      const { accessToken, isAuthenticated } = state.user;

      if (!isAuthenticated || !accessToken) {
        Alert.alert(
          'Authentication Required',
          'Please log in to save recipes from Instagram',
          [{ text: 'OK' }]
        );
        return;
      }

      const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
      if (!BACKEND_URL) {
        console.error('❌ ShareHandler: Backend URL not configured');
        Alert.alert('Error', 'Backend URL not configured');
        return;
      }

      console.log('🚀 ShareHandler: Sending to backend:', {
        url: `${BACKEND_URL}/extract-recipe`,
        body: { url }
      });

      const response = await axios.post(
        `${BACKEND_URL}/extract-recipe`,
        { url },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ ShareHandler: Backend response:', response.data);

      if (response.data.success) {
        Alert.alert(
          'Success',
          'Recipe extracted successfully!',
          [{ text: 'OK' }]
        );
        
        // Emit event or trigger refresh in the app
        // You can use EventEmitter or a callback here
      } else {
        Alert.alert(
          'Error',
          response.data.message || 'Failed to extract recipe',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('❌ ShareHandler: Error sending to backend:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          Alert.alert(
            'Authentication Error',
            'Your session has expired. Please log in again.',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert(
            'Error',
            error.response?.data?.message || 'Failed to extract recipe. Please try again.',
            [{ text: 'OK' }]
          );
        }
      } else {
        Alert.alert(
          'Error',
          'An unexpected error occurred. Please try again.',
          [{ text: 'OK' }]
        );
      }
    }
  }
}

export default ShareHandler;
