import { Helmet } from 'react-helmet-async';

function HelmetComponent() {
  return (
    <Helmet>
      {/* 오프라인 점검: Google Fonts 요청 중지
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&amp;display=swap"
        as="style"
      />

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&amp;display=swap"
      />
      */}
    </Helmet>
  );
}

export default HelmetComponent;