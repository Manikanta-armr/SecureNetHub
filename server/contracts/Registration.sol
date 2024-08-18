// SPDX-License-Identifier:MIT
pragma solidity 0.8.4;

contract Register {

    struct Profile {
        string profilename;
        string username;
        string password;
        string pic;
        address wallet;
    }
    
    struct Tweet{
        uint id;
        string profilename;
        string username;
        string pic;
        address wallet_address;
        string tweetText;
        string ipfshash;
        string filetype;
        uint timestamp;
        bool isDeleted;
    }

    Tweet[] private tweets;
    Profile[] private prof;

    mapping(uint256 => address) tweetToOwner;
    mapping(address=>Profile) profile_mapping;
    mapping(address=>bool) register_or_not;
    mapping(address=>uint) active_post;
    mapping(address=>uint) deleted_post;

    function addProfile(string memory _profilename,string memory _username,string memory _password,string memory _ipfshash) external{
        prof.push(Profile(_profilename,_username,_password,_ipfshash,msg.sender));
        profile_mapping[msg.sender]=Profile(_profilename,_username,_password,_ipfshash,msg.sender);
        register_or_not[msg.sender]=true;
    }

    function getAllProfiles() external view returns (Profile[] memory) {
        uint counter = 0;
        for (uint i = 0; i < prof.length; i++) {
            if (prof[i].wallet != msg.sender) {
                counter++;
            }
        }
        Profile[] memory result = new Profile[](counter);
        uint resultIndex = 0;
        for (uint i = 0; i < prof.length; i++) {
            if (prof[i].wallet != msg.sender) {
                result[resultIndex] = prof[i];
                resultIndex++;
            }
        }
        return result;
    }


    function isRegister() external view returns (bool isregistered){
        return register_or_not[msg.sender];
    }

    function gettingCredentials() external view returns (Profile memory info){
        return profile_mapping[msg.sender];
    }

    function addTweet(string memory tweetText,string memory ipfshash,string memory filetype,uint timestamp, bool isDeleted) external {
        uint tweetId = tweets.length;
        Profile memory p=profile_mapping[msg.sender];
        tweets.push(Tweet(tweetId, p.profilename, p.username, p.pic, msg.sender, tweetText, ipfshash, filetype, timestamp, isDeleted));
        tweetToOwner[tweetId] = msg.sender;
        active_post[msg.sender]+=1;
    }

    function getAllTweets() external view returns (Tweet[] memory) {
        uint counter = 0;
        for (uint i = tweets.length; i > 0; i--) {
            if (tweets[i - 1].isDeleted == false) {
                counter++;
            }
        }
        Tweet[] memory temporary = new Tweet[](counter);
        counter=0;
        for (uint i = tweets.length; i > 0; i--) {
            if (tweets[i - 1].isDeleted == false) {
                temporary[counter] = tweets[i - 1];
                counter++;
            }
        }
        return temporary;
    }

     function getMyTweets() external view returns (Tweet[] memory) {
        Tweet[] memory temporary = new Tweet[](tweets.length);
        uint counter = 0;
        for (uint i = tweets.length; i > 0; i--) {
            if (tweets[i - 1].isDeleted == false && tweets[i-1].wallet_address==msg.sender) {
                temporary[counter] = tweets[i - 1];
                counter++;
            }
        }

        Tweet[] memory result = new Tweet[](counter);
        for(uint i=0; i<counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }

    function deleteTweet(uint tweetId, bool isDeleted) external {
        if(tweetToOwner[tweetId] == msg.sender) {
            tweets[tweetId].isDeleted = isDeleted;
            active_post[msg.sender]-=1;
            deleted_post[msg.sender]+=1;
        }
    }

    function deleteCount() external view returns (uint count){
        return deleted_post[msg.sender];
    }

    function activeCount() external view returns (uint count){
        return active_post[msg.sender];
    }
    
}