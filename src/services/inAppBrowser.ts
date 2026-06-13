import {
  AndroidAnimation,
  AndroidViewStyle,
  DismissStyle,
  InAppBrowser,
  iOSAnimation,
  iOSViewStyle,
  ToolbarPosition,
} from '@capacitor/inappbrowser';

export async function openUrlInApp(url: string) {
  await InAppBrowser.openInWebView({
    url,
    options: {
      showURL: true,
      showToolbar: true,
      clearCache: false,
      clearSessionCache: false,
      mediaPlaybackRequiresUserAction: false,
      closeButtonText: 'Close',
      toolbarPosition: ToolbarPosition.TOP,
      showNavigationButtons: true,
      leftToRight: false,
      android: {
        allowZoom: true,
        hardwareBack: true,
        isIsolated: false,
        pauseMedia: true,
      },
      iOS: {
        allowInLineMediaPlayback: true,
        allowOverScroll: true,
        allowsBackForwardNavigationGestures: true,
        animationEffect: iOSAnimation.COVER_VERTICAL,
        enableViewportScale: true,
        surpressIncrementalRendering: false,
        viewStyle: iOSViewStyle.FULL_SCREEN,
      },
    },
  });
}

export async function openUrlInSystemBrowser(url: string) {
  await InAppBrowser.openInSystemBrowser({
    url,
    options: {
      android: {
        hideToolbarOnScroll: false,
        showTitle: true,
        startAnimation: AndroidAnimation.FADE_IN,
        exitAnimation: AndroidAnimation.FADE_OUT,
        viewStyle: AndroidViewStyle.FULL_SCREEN,
      },
      iOS: {
        animationEffect: iOSAnimation.COVER_VERTICAL,
        closeButtonText: DismissStyle.CLOSE,
        enableBarsCollapsing: true,
        enableReadersMode: false,
        viewStyle: iOSViewStyle.FULL_SCREEN,
      },
    },
  });
}
