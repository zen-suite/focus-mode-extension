export default function BlockedSite() {
  return (
    <div>
      <div
        style={{
          backgroundImage: "url('/example.jpg')",
          width: '100vw',
          height: '100vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          zIndex: '-1',
          position: 'absolute',
          filter: 'brightness(60%)',
        }}
      />
      Hello world
    </div>
  )
}
