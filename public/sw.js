self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (error) {
    data = {
      title: "더세이브철거 새 상담",
      body: event.data
        ? event.data.text()
        : "새로운 상담 메시지가 도착했습니다.",
    };
  }

  const title = data.title || "더세이브철거 새 상담 메시지";

  const options = {
    body: data.body || "새로운 상담 메시지가 도착했습니다.",

    /*
     * 알림에 표시되는 아이콘
     */
    icon: "/icon-192.png",

    /*
     * 지원되는 환경에서 사용하는 작은 알림 아이콘
     */
    badge: "/icon-192.png",

    /*
     * 같은 상담방의 알림을 구분하기 위한 태그
     */
    tag: data.tag || "thesave-chat",

    /*
     * 동일한 tag의 알림이 다시 들어왔을 때
     * 새로운 알림임을 사용자에게 알림
     */
    renotify: true,

    /*
     * 알림을 눌렀을 때 사용할 정보
     */
    data: {
      url: data.url || "/admin/chat",
      roomId: data.roomId || null,
    },
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl =
    event.notification.data?.url || "/admin/chat";

  /*
   * 상대경로를 현재 사이트 기준의 절대 URL로 변환
   */
  const targetAbsoluteUrl = new URL(
    targetUrl,
    self.location.origin
  ).href;

  event.waitUntil(
    self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then(async (clientList) => {
        /*
         * 이미 더세이브 관리자 페이지가 열려 있다면
         * 기존 창을 해당 상담 페이지로 이동시킨 뒤 포커스
         */
        for (const client of clientList) {
          if (
            "focus" in client &&
            client.url.startsWith(self.location.origin)
          ) {
            if ("navigate" in client) {
              await client.navigate(targetAbsoluteUrl);
            }

            return client.focus();
          }
        }

        /*
         * 열려 있는 관리자 페이지가 없다면
         * 새로운 창으로 관리자 상담 페이지 열기
         */
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetAbsoluteUrl);
        }

        return undefined;
      })
  );
});