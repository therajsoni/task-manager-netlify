"use client";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type FeatherContextType = {
  FitRefreshDb: boolean;
  setFitRefreshDb: Dispatch<SetStateAction<boolean>>;
  // ShowFeaturesForUserTableTabs: boolean;
  // setShowFeaturesForUserTableTabs: Dispatch<SetStateAction<boolean>>;
  setKeyDefine: Dispatch<SetStateAction<string>>;
  setHitGetShowingFeatures: Dispatch<SetStateAction<boolean>>;
  renderFeatures: any;
};
const FeaturesContext = createContext<FeatherContextType>({
  FitRefreshDb: false,
  setFitRefreshDb: () => {},
  // ShowFeaturesForUserTableTabs: false,
  // setShowFeaturesForUserTableTabs: () => {},
  setKeyDefine: () => {},
  setHitGetShowingFeatures: () => {},
  renderFeatures: {},
});

export const FeatureProvider = ({ children }: { children: ReactNode }) => {
  const [FitRefreshDb, setFitRefreshDb] = useState(false);
  const [keyDefine, setKeyDefine] = useState<string>("");
  const [renderFeatures, setRenderFeatures] = useState<{}>({});
  const [ShowFeaturesForUserTableTabs, setShowFeaturesForUserTableTabs] =
    useState<{} | null>({});
  const [hitGetShowingFeatures, setHitGetShowingFeatures] = useState(false);
  const getShowingFeatures = async (key: string) => {
    const request = await fetch("/api/projectFeature", {
      method: "POST",
      body: JSON.stringify({
        key,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }); //http://localhost:3000/api/projectFeature
    const response = await request.json();
    console.log(response, "Response-+09()");
    console.log(response, "Response");
    if (request.ok && response.success) {
      const dataResponse = response?.data;
      let objBody = {};
      console.log(objBody, "----OBJECTBODY----");

      dataResponse?.features?.map(
        (d: { key: string; value: string; data: string }) => {
          console.log(d, "d");
          objBody[d.key] = d.value;
        }
      );
      setRenderFeatures(objBody);
    } else {
      setRenderFeatures({});
    }
    return response;
  };
  useEffect(() => {
    if (hitGetShowingFeatures === true) {
      getShowingFeatures(keyDefine);
      setHitGetShowingFeatures(false);
    }
  }, [hitGetShowingFeatures]);
  const postUpdateTaskFeatures = async (
    key: string,
    features: [
      {
        key: String;
        value: String;
        data: String;
      }
    ]
  ) => {
    const request = await fetch("/api/projectFeature/post", {
      method: "POST",
      body: JSON.stringify({
        key,
        features,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }); //http://localhost:3000/api/projectFeature
    const response = await request.json();
    return response;
  };
  return (
    <FeaturesContext.Provider
      value={{
        FitRefreshDb,
        setFitRefreshDb,
        setKeyDefine,
        setHitGetShowingFeatures,
        renderFeatures,
        // ShowFeaturesForUserTableTabs,
        // setShowFeaturesForUserTableTabs,
      }}
    >
      {children}
    </FeaturesContext.Provider>
  );
};
export const useFeatureProvider = () => useContext(FeaturesContext);
