import { FaInstagram, FaGlobe } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const PlugIn = ({ contestId }) => {
  // Social media links for ZeeContest
  const socialLinks = {
    instagram: 'https://www.instagram.com/zeecontest?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    x: 'https://twitter.com/zeecontest', // Assuming a Twitter handle, adjust if needed
    website: 'https://zeecontest.com' // Assuming a website, adjust if needed
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Plug In ⚡</h3>
      <p className="text-gray-600 mb-4">
        Stay connected with ZeeContest! Follow us on social media for the latest updates, behind-the-scenes content, and more.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {Object.entries(socialLinks).map(([platform, link]) => {
          let Icon;
          let label;
          let color;
          switch (platform) {
            case 'instagram':
              Icon = FaInstagram;
              label = 'Follow on Instagram';
              color = 'text-pink-500 hover:text-pink-600';
              break;
            case 'x':
              Icon = FaXTwitter;
              label = 'Follow on X (Twitter)';
              color = 'text-blue-500 hover:text-blue-600';
              break;
            case 'website':
              Icon = FaGlobe;
              label = 'Visit Our Website';
              color = 'text-gray-500 hover:text-gray-600';
              break;
            default:
              return null;
          }
          return (
            <a
              key={platform}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${color}`}
            >
              <Icon size={24} />
              <span className="font-medium">{label}</span>
            </a>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg">
        <p className="text-sm font-medium">
          🎉 Don't forget to tag us in your contest posts and use #ZeeContest!
        </p>
      </div>
    </div>
  );
};

export default PlugIn;
