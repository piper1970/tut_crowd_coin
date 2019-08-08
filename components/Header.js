import React, { useState } from "react";
import { Menu, Button } from "semantic-ui-react";


const Header = () => {
  const [activeItem, setActiveItem] = useState();

  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
  };

  return (
    <Menu style={{marginTop: '10px'}}>
      <Menu.Item
        name="crowdcoin"
        active={activeItem === "crowdcoin"}
        onClick={handleItemClick}
      >
        CrowdCoin
      </Menu.Item>
      <Menu.Menu position="right">
        <Menu.Item
          name="campaigns"
          active={activeItem === "campaigns"}
          onClick={handleItemClick}
        >
          Campaigns
        </Menu.Item>
        <Menu.Item
          name="addCampaign"
          active={activeItem === "addCampaign"}
          onClick={handleItemClick}
        >
        <i aria-hidden="true" class="add icon"></i>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
