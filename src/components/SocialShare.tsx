import React, { useEffect, useState } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

const SocialShare: React.FC = () => {
  const [pageUrl, setPageUrl] = useState('');
  const title = encodeURIComponent('AI Benchmark Explorer - Explore benchmark datasets from Papers With Code');

  // Set the page URL after component mounts to ensure we have the correct URL
  useEffect(() => {
    // In production, use the canonical URL if available, otherwise use the current URL
    const metaOgUrl = document.querySelector('meta[property="og:url"]');
    if (metaOgUrl && metaOgUrl.getAttribute('content')) {
      setPageUrl(encodeURIComponent(metaOgUrl.getAttribute('content') || ''));
    } else {
      setPageUrl(encodeURIComponent(window.location.href));
    }
  }, []);

  // Social media sharing URLs
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${title}`;

  // Open share dialog in a new window
  const handleShare = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Tooltip title="Share on LinkedIn">
        <IconButton 
          color="inherit" 
          onClick={() => handleShare(linkedinUrl)}
          aria-label="Share on LinkedIn"
          disabled={!pageUrl}
        >
          <LinkedInIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Share on Facebook">
        <IconButton 
          color="inherit" 
          onClick={() => handleShare(facebookUrl)}
          aria-label="Share on Facebook"
          disabled={!pageUrl}
        >
          <FacebookIcon />
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Share on Twitter">
        <IconButton 
          color="inherit" 
          onClick={() => handleShare(twitterUrl)}
          aria-label="Share on Twitter"
          disabled={!pageUrl}
        >
          <TwitterIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default SocialShare;
