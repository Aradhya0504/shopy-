const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
        {/* Spinning Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  )
}

export default Loader;