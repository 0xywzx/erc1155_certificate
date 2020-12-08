pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155Certificate is ERC1155("test") {
  using SafeMath for uint;

  uint256 internal certificateId = 0;
  mapping (address => uint[]) public myCertificateId;
  // mapping (uint256 => address) public certificateIssuer; // operatorが用意されているからいらないかも

  struct Certificate {
    uint256 id;
    string nameOfCertificate;
    address issuer;
    uint256 issuedata;
  }

  Certificate[] public certificates;

  constructor() public { }

  function issueCertificate(string calldata _nameOfCertificate, uint256 numberOfCertificate, address[] calldata _toAddresses, bytes calldata _data) external {
    certificateId = certificateId.add(1);
    _mint(msg.sender, certificateId, numberOfCertificate, _data);
    certificates.push(Certificate(certificateId, _nameOfCertificate, msg.sender, now));
    for (uint i = 0; i < numberOfCertificate; i++ ) {
      safeTransferFrom(msg.sender, _toAddresses[i], certificateId, 1, _data);
      myCertificateId[_toAddresses[i]].push(certificateId);
    }
  }

  function getMyCertificateId(address _certificateHolder) external view returns (uint[] memory) {
    return myCertificateId[_certificateHolder];
  }

}