import Link from 'next/link';
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700']
});

export default function Footer() {
  return (
    <footer className={`${poppins.className} bg-black text-gray-400 py-8 mt-24`}>
      <div className="text-center space-y-6">
        <p className="text-sm">
          Need help? Email{' '}
          <a href="mailto:hello@fireship.io" className="text-gray-400 hover:text-white underline">
            sagarhimanshu472@gmail.com
          </a>
        </p>
        <div className="flex justify-center space-x-6">
          <a target='_blank' href="https://x.com/hiimaaanshuuuu" className="text-gray-400 hover:text-white" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.954 4.569c-.885.39-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.949.564-2.007.974-3.127 1.195-.897-.959-2.178-1.555-3.594-1.555-2.72 0-4.924 2.203-4.924 4.917 0 .39.045.765.127 1.124-4.09-.205-7.72-2.165-10.148-5.144-.424.729-.666 1.571-.666 2.475 0 1.708.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.062c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.317 0-.626-.03-.928-.086.627 1.956 2.444 3.379 4.6 3.419-1.68 1.319-3.809 2.107-6.102 2.107-.396 0-.788-.023-1.174-.067 2.179 1.397 4.768 2.213 7.548 2.213 9.056 0 14.009-7.504 14.009-14.008 0-.21-.006-.423-.015-.633.961-.689 1.796-1.56 2.457-2.548l-.047-.02z" />
            </svg>
          </a>
          <a target='_blank' href="https://github.com/Himanshuu23" className="text-gray-400 hover:text-white" aria-label="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.63 0-12 5.37-12 12 0 5.3 3.438 9.8 8.205 11.385.6.113.82-.255.82-.57 0-.28-.01-1.02-.015-2.005-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.332-1.755-1.332-1.755-1.086-.744.084-.729.084-.729 1.2.084 1.835 1.234 1.835 1.234 1.067 1.83 2.804 1.3 3.49.995.108-.773.42-1.302.762-1.602-2.665-.305-5.467-1.335-5.467-5.93 0-1.31.465-2.38 1.235-3.22-.124-.305-.535-1.53.115-3.18 0 0 1.005-.32 3.3 1.22.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.54 3.285-1.22 3.285-1.22.655 1.65.245 2.875.12 3.18.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.81 1.1.81 2.22 0 1.6-.015 2.88-.015 3.27 0 .315.21.69.825.57 4.755-1.585 8.205-6.085 8.205-11.385 0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <a href="#" target='_blank' className="text-gray-400 hover:text-white" aria-label="Discord">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.075.075 0 00-.079.038c-.21.37-.444.853-.608 1.234-1.844-.275-3.68-.275-5.486 0a11.775 11.775 0 00-.617-1.235.077.077 0 00-.079-.037c-1.704.316-3.336.87-4.884 1.515a.069.069 0 00-.032.027C1.533 9.042.805 13.481.893 17.859a.081.081 0 00.031.056c2.052 1.52 4.044 2.444 6.002 3.052a.078.078 0 00.084-.027c.461-.63.873-1.295 1.226-1.993a.076.076 0 00-.041-.104c-.652-.247-1.27-.548-1.872-.892a.077.077 0 01-.008-.129c.126-.094.252-.191.373-.287a.075.075 0 01.077-.01c3.926 1.793 8.18 1.793 12.06 0a.073.073 0 01.079.009c.122.097.247.193.374.287a.077.077 0 01-.006.13c-.603.344-1.22.645-1.872.891a.077.077 0 00-.041.105c.36.697.772 1.362 1.226 1.993a.077.077 0 00.084.028c1.958-.608 3.95-1.532 6.002-3.052a.076.076 0 00.031-.056c.114-5.204-1.033-9.598-4.621-13.464a.064.064 0 00-.032-.027zM8.205 14.01c-1.062 0-1.933-.962-1.933-2.144 0-1.182.853-2.144 1.933-2.144 1.082 0 1.955.962 1.933 2.144 0 1.182-.853 2.144-1.933 2.144zm7.59 0c-1.062 0-1.933-.962-1.933-2.144 0-1.182.853-2.144 1.933-2.144 1.082 0 1.955.962 1.933 2.144 0 1.182-.851 2.144-1.933 2.144z" />
            </svg>
          </a>
        </div>
        <div>
          <p className="font-bold text-gray-400 text-sm">HELPFUL LINKS</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link legacyBehavior href="#">
              <a className="text-gray-400 hover:text-white text-sm">Courses</a>
            </Link>
            <Link legacyBehavior href="#">
              <a className="text-gray-400 hover:text-white text-sm">Labs</a>
            </Link>
            <Link legacyBehavior href="#">
              <a className="text-gray-400 hover:text-white text-sm">Snippets</a>
            </Link>
            <Link legacyBehavior href="#">
              <a className="text-gray-400 hover:text-white text-sm">Tags</a>
            </Link>
            <Link legacyBehavior href="#">
              <a className="text-gray-400 hover:text-white text-sm">Contrib</a>
            </Link>
            <Link legacyBehavior href="#">
              <a className="text-gray-400 hover:text-white text-sm">Privacy</a>
            </Link>
            <Link legacyBehavior href="#">
              <a className="text-gray-400 hover:text-white text-sm">Terms</a>
            </Link>
          </div>
        </div>
        <p className="text-xs text-gray-400">Copyright &copy; 2024 summary LLC</p>
      </div>
    </footer>
  );
}
