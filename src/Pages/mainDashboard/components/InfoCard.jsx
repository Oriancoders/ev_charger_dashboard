// src/components/InfoCard.jsx

const InfoCard = ({ title, value, icon }) => {
    return (
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold  text-[#1E1E2F]"><i>{title}</i></h3>
            <p className="text-sm text-[#AFAFAF]">Total {title.toLowerCase()} supplied</p>
          </div>
          <span className="text-2xl text-[#0A86F0]">{icon}</span>
        </div>
        <p className="text-xl font-semibold mt-3 text-[#1E1E2F]"><i>{value}</i></p>
      </div>
    );
  };
  
  export default InfoCard;
  