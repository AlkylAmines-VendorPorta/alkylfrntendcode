import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { drop } from "lodash-es";


const SidebarLink = styled(Link)`
display: flex;
color: #e1e9fc;
justify-content: space-between;
align-items: center;
padding: 20px;
list-style: none;
height: 60px;
text-decoration: none;
font-size: 18px;

&:hover {
	background-color: #1a83ff;
	border-left: 4px solid green;
	cursor: pointer;
}
`;

const SidebarLabel = styled.span`
text-decoration: none;
    color: rgb(255, 255, 255);
    font-size: 18px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    /* padding: 0 0; */
    border-radius: 90px;
`;

const DropdownLink = styled(Link)`
background: #252831;
height: 60px;
padding-left: 3rem;
display: flex;
align-items: center;
text-decoration: none;
color: #f5f5f5;
font-size: 18px;

&:hover {

	background-color: #1a83ff;
	cursor: pointer;
}
`;

const SubMenu = ({ item }) => {
const [subcategory, setsubCategory] = useState(false);


const showSubnav = () => setsubCategory(!subcategory);
const iconClosed = <RiIcons.RiArrowDownSFill />
const iconOpened = <RiIcons.RiArrowUpSFill />



return (


	
	<>
	{/* <SidebarLink onClick={item.subCategory && showSubnav}>
 
		<div>
		
		<SidebarLabel >{item.name}</SidebarLabel>
		</div>
		<div>
		{item.subCategory && subcategory
			? iconOpened
			: item.subCategory
			? iconClosed
			: null}
		</div>
		
	</SidebarLink>
	{subcategory && item.subCategory.map((sm, index) => {
		return (
			
			<DropdownLink to={sm.code} key={index}>
			
			
			<SidebarLabel>{sm.name}</SidebarLabel>
			</DropdownLink>
		);
		})} */}





		<div className="dropdown">
	
		<span className="dropbtn" >{item.name}
		&nbsp;&nbsp;&nbsp;&nbsp;
		{/* <i class="fa fa-caret-down"></i> */}
		{item.subCategory && subcategory
			? iconOpened
			: item.subCategory
			? iconClosed
			: null}
		</span>
		
		
		 
	
			<div className="dropdown-content">
			
		{item.subCategory.map((sm, index) => {
		return (
		<li>
			<a href={sm.code}>{sm.name}</a></li>
			
		);
		})}
			</div>
			</div>

		
	</>
);
};

export default SubMenu;
