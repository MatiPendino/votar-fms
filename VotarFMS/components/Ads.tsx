import { 
  BannerAd, TestIds, BannerAdSize, AdEventType, InterstitialAd
} from 'react-native-google-mobile-ads';

export const Banner = ({bannerId}: {bannerId: string}) => {
    const adUnitIdBanner: string = (
        Boolean(Number(process.env.EXPO_PUBLIC_TEST_ADS)) ? TestIds.BANNER : bannerId
    );

    return (
        <BannerAd
            unitId={adUnitIdBanner}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{requestNonPersonalizedAdsOnly: true}}
        />
    )
}

export const interstitial = (interstitialId: string) => {
    const adUnitIdInterst: string = (
      Boolean(Number(process.env.EXPO_PUBLIC_TEST_ADS)) 
      ? TestIds.INTERSTITIAL 
      : interstitialId
    ); 
    const interstitial: InterstitialAd = InterstitialAd.createForAdRequest(adUnitIdInterst);
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        interstitial.show();
    });
    interstitial.load();
      
    return unsubscribe;
}
