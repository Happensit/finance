import React, { useEffect, useRef, useState } from 'react';
import { renderIcon } from '@download/blockies';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
// import Hidden from '@material-ui/core/Hidden';
// import IconButton from '@material-ui/core/IconButton';
// import { WbSunny, NightsStay } from '@material-ui/icons';
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.js';
import Button from 'components/CustomButtons/Button.js';
import { useTranslation } from 'react-i18next';

import styles from './styles';

const useStyles = makeStyles(styles);

const HeaderLinks = ({
  connected,
  address,
  connectWallet,
  disconnectWallet,
  isNightMode,
  setNightMode,
}) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [lng, setLanguage] = useState('en');
  const [shortAddress, setShortAddress] = useState('');
  const [dataUrl, setDataUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const cachedLanguage = i18n.language;
    if (!cachedLanguage) {
      return;
    }

    const languageCode = cachedLanguage.split('-')[0].toLowerCase();
    setLanguage(languageCode);
  }, [i18n.language]);

  useEffect(() => {
    if (!connected) {
      return;
    }

    const canvas = canvasRef.current;
    renderIcon({ seed: address.toLowerCase() }, canvas);
    const updatedDataUrl = canvas.toDataURL();
    if (updatedDataUrl !== dataUrl) {
      setDataUrl(updatedDataUrl);
    }
    if (address.length < 11) {
      setShortAddress(address);
    } else {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [dataUrl, address, connected]);

  const handleClick = event => {
    switch (event) {
      case 'Deutsch':
        return i18n.changeLanguage('de').then(() => setLanguage(event));
      case 'English':
        return i18n.changeLanguage('en').then(() => setLanguage(event));
      case 'Pусский':
        return i18n.changeLanguage('ru').then(() => setLanguage(event));
      case 'Українська':
        return i18n.changeLanguage('uk').then(() => setLanguage(event));
      // TODO: more translations
      default:
        return;
    }
  };

  return (
    <List className={classes.list + ' ' + classes.mlAuto}>
       {/*<Hidden smDown>
        <ListItem className={classes.listItem}>
         <IconButton onClick={setNightMode} className={classes.iconButton}>
            {isNightMode ? <WbSunny /> : <NightsStay />}
          </IconButton>
        </ListItem>
      </Hidden>*/}
      <ListItem className={classes.listItem}>
        <CustomDropdown
          navDropdown
          hoverColor="dark"
          buttonText={lng}
          buttonProps={{
            className: classes.navLink,
            color: 'transparent',
          }}
          onClick={handleClick}
          dropdownList={[
           
            'English',
            'Pусский',
            'Українська'
          ]}
        />
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          disableElevation
          className={classes.walletDisplay}
          onClick={connected ? disconnectWallet : connectWallet}
        >
          {connected ? (
            <>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <Avatar
                alt="address"
                src={dataUrl}
                style={{
                  width: '24px',
                  height: '24px',
                  marginRight: '4px',
                }}
              />
              {shortAddress}
            </>
          ) : (
            <>
              <i className={classes.icon + ' far fa-question-circle'} />
              {t('Vault-Wallet')}
            </>
          )}
        </Button>
      </ListItem>
    </List>
  );
};

export default HeaderLinks;
