export default function Footer() {
    return (
      <footer>
        <div className="w-full bg-background py-4">
          <p className="text-center text-sm">
            &copy; 2025 - {new Date().getFullYear()} Red Oxford Online
          </p>
        </div>
      </footer>
    );
  }