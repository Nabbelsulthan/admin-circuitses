
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import cesLogo from "../../assets/logo1.png";
import "./Procurement.css";
import "./ProcurementPrint.css";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://api.circuitses.com";

const API_ROOT = `${API_BASE}/api`;

/* =========================================================
   AUTH
   ========================================================= */

function getAdminToken() {

  return localStorage.getItem("adminToken");

}

async function apiRequest(endpoint, options = {}) {
  const token = getAdminToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_ROOT}${endpoint}`, {
    ...options,
    headers,
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`
    );
  }

  return data;
}


/* =========================================================
   HELPERS
   ========================================================= */

function normalizeArray(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.rows)) {
    return data.rows;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.projects)) {
    return data.projects;
  }

  if (Array.isArray(data?.vendors)) {
    return data.vendors;
  }

  if (Array.isArray(data?.makes)) {
    return data.makes;
  }

  if (Array.isArray(data?.materials)) {
    return data.materials;
  }

  return [];
}


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function Procurement() {
  const [activeTab, setActiveTab] = useState("overview");

  const [vendors, setVendors] = useState([]);
  const [makes, setMakes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [projects, setProjects] = useState([]);

  const [selectedProject, setSelectedProject] = useState("");
  const [projectMaterials, setProjectMaterials] = useState([]);

  const [loading, setLoading] = useState(true);
  const [vendorLoading, setVendorLoading] = useState(true);
  const [makeLoading, setMakeLoading] = useState(true);
  const [materialLoading, setMaterialLoading] = useState(true);
  const [projectLoading, setProjectLoading] = useState(false);

  const [error, setError] = useState("");

  const [savingVendor, setSavingVendor] = useState(false);
  const [savingMake, setSavingMake] = useState(false);
  const [savingMaterial, setSavingMaterial] = useState(false);
  const [savingBomItem, setSavingBomItem] = useState(false);

  const [vendorSearch, setVendorSearch] = useState("");
  const [makeSearch, setMakeSearch] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");
  const [recordStatusView, setRecordStatusView] = useState("active");


  const [pendingDelete, setPendingDelete] = useState(null);
  const [deletingRecord, setDeletingRecord] = useState(false);

  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showMakeModal, setShowMakeModal] = useState(false);
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showBomModal, setShowBomModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [savingProject, setSavingProject] = useState(false);

  const [editingVendor, setEditingVendor] = useState(null);
  const [editingMake, setEditingMake] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editingBomItem, setEditingBomItem] = useState(null);

  const [vendorForm, setVendorForm] = useState({
    vendor_name: "",
  });

  const [makeForm, setMakeForm] = useState({
    make_name: "",
  });

  const [materialForm, setMaterialForm] = useState({
    material_name: "",
    current_cost: "",
    default_make_id: "",
    preferred_vendor_id: "",
  });

  const [projectForm, setProjectForm] = useState({
    project_name: "",
    description: "",
  });

  const emptyBomForm = {
    material_id: "",
    make_id: "",
    vendor_id: "",
    quantity: 1,
    unit: "Nos",
    unit_cost: "",
    remarks: "",
  };

  const [bomForm, setBomForm] = useState(emptyBomForm);

  const [bomMaterialSearch, setBomMaterialSearch] = useState("");
  const [bomMakeSearch, setBomMakeSearch] = useState("");
  const [bomVendorSearch, setBomVendorSearch] = useState("");

  /* =========================================================
     LOAD MASTER DATA
     ========================================================= */

  async function loadMasterData() {
    setLoading(true);
    setVendorLoading(true);
    setMakeLoading(true);
    setMaterialLoading(true);
    setError("");

    try {
      const [vendorsData, makesData, materialsData] =
        await Promise.all([
          apiRequest("/procurement/vendors?includeInactive=true"),
          apiRequest("/procurement/makes?includeInactive=true"),
          apiRequest("/procurement/materials?includeInactive=true"),
        ]);

      setVendors(normalizeArray(vendorsData));
      setMakes(normalizeArray(makesData));
      setMaterials(normalizeArray(materialsData));
    } catch (err) {
      console.error("Procurement master data error:", err);
      setError(err.message || "Failed to load procurement data.");
    } finally {
      setLoading(false);
      setVendorLoading(false);
      setMakeLoading(false);
      setMaterialLoading(false);
    }
  }


  /* =========================================================
     LOAD PROJECTS
     ========================================================= */

  // async function loadProjects() {
  //   try {
  //     const data = await apiRequest("/projects");

  //     setProjects(normalizeArray(data));
  //   } catch (err) {
  //     console.error("Projects loading error:", err);

  //     setError(
  //       (current) =>
  //         current ||
  //         err.message ||
  //         "Failed to load projects."
  //     );
  //   }
  // }


  async function loadProjects() {
    try {
      const data = await apiRequest(
        "/procurement/projects"
      );

      setProjects(normalizeArray(data));
    } catch (err) {
      console.error(
        "Procurement projects loading error:",
        err
      );

      setError(
        (current) =>
          current ||
          err.message ||
          "Failed to load procurement projects."
      );
    }
  }


  useEffect(() => {
    loadMasterData();
    loadProjects();
  }, []);


  /* =========================================================
     LOAD PROJECT BOM
     ========================================================= */

  async function loadProjectMaterials(projectId) {
    if (!projectId) {
      setProjectMaterials([]);
      return;
    }

    setProjectLoading(true);
    setError("");

    try {
      const data = await apiRequest(
        `/procurement/projects/${projectId}/materials`
      );

      setProjectMaterials(normalizeArray(data));
    } catch (err) {
      console.error("Project materials error:", err);

      setError(
        err.message || "Failed to load project materials."
      );

      setProjectMaterials([]);
    } finally {
      setProjectLoading(false);
    }
  }


  function handleProjectChange(event) {
    const projectId = event.target.value;

    setSelectedProject(projectId);

    loadProjectMaterials(projectId);
  }


  /* =========================================================
     NOTIFICATIONS
     ========================================================= */

  function showSuccess(message) {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
    });
  }


  /* =========================================================
     VENDOR
     ========================================================= */

  function openAddVendor() {
    setEditingVendor(null);

    setVendorForm({
      vendor_name: "",
    });

    setShowVendorModal(true);
  }


  function openEditVendor(vendor) {
    setEditingVendor(vendor);

    setVendorForm({
      vendor_name: vendor.vendor_name || "",
    });

    setShowVendorModal(true);
  }


  async function saveVendor(event) {
    event.preventDefault();

    if (!vendorForm.vendor_name.trim()) {
      toast.error("Vendor name is required.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (savingVendor) {
      return;
    }

    try {
      setSavingVendor(true);
      setError("");

      if (editingVendor) {
        await apiRequest(
          `/procurement/vendors/${editingVendor.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              vendor_name: vendorForm.vendor_name.trim(),
              status: editingVendor.status,
            }),
          }
        );

        showSuccess("Vendor updated successfully.");
      } else {
        await apiRequest("/procurement/vendors", {
          method: "POST",
          body: JSON.stringify({
            vendor_name: vendorForm.vendor_name.trim(),
          }),
        });

        showSuccess("Vendor added successfully.");
      }

      setShowVendorModal(false);

      await loadMasterData();
    } catch (err) {
      toast.error(
        err.message || "Failed to save vendor.",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    } finally {
      setSavingVendor(false);
    }
  }


  // async function deleteVendor(vendor) {
  //   const confirmed = window.confirm(
  //     `Permanently delete vendor "${vendor.vendor_name}"? This cannot be undone.`
  //   );
  //   if (!confirmed) return;

  //   try {
  //     await apiRequest(`/procurement/vendors/${vendor.id}`, {
  //       method: "DELETE",
  //     });
  //     showSuccess("Vendor permanently deleted.");
  //     await loadMasterData();
  //   } catch (err) {
  //     toast.error(
  //       err.message || "Unable to delete vendor. It may be referenced by a project BOM.",
  //       { position: "top-right", autoClose: 4500 }
  //     );
  //   }
  // }



  function deleteVendor(vendor) {
    setPendingDelete({
      type: "vendor",
      id: vendor.id,
      name: vendor.vendor_name,
      title: "Delete Vendor",
      message:
        "This vendor will be permanently deleted. This action cannot be undone.",
    });
  }


  async function toggleVendorStatus(vendor) {
    try {
      await apiRequest(
        `/procurement/vendors/${vendor.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            vendor_name: vendor.vendor_name,
            status:
              vendor.status === "active"
                ? "inactive"
                : "active",
          }),
        }
      );

      showSuccess(
        vendor.status === "active"
          ? "Vendor deactivated."
          : "Vendor activated."
      );

      await loadMasterData();
    } catch (err) {
      setError(err.message || "Failed to update vendor.");
    }
  }


  /* =========================================================
     MAKE
     ========================================================= */

  function openAddMake() {
    setEditingMake(null);

    setMakeForm({
      make_name: "",
    });

    setShowMakeModal(true);
  }


  function openEditMake(make) {
    setEditingMake(make);

    setMakeForm({
      make_name: make.make_name || "",
    });

    setShowMakeModal(true);
  }


  async function saveMake(event) {
    event.preventDefault();

    if (!makeForm.make_name.trim()) {
      toast.error("Make name is required.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (savingMake) {
      return;
    }

    try {
      setSavingMake(true);
      setError("");

      if (editingMake) {
        await apiRequest(
          `/procurement/makes/${editingMake.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              make_name: makeForm.make_name.trim(),
              status: editingMake.status,
            }),
          }
        );

        showSuccess("Make updated successfully.");
      } else {
        await apiRequest("/procurement/makes", {
          method: "POST",
          body: JSON.stringify({
            make_name: makeForm.make_name.trim(),
          }),
        });

        showSuccess("Make added successfully.");
      }

      setShowMakeModal(false);

      await loadMasterData();
    } catch (err) {
      toast.error(
        err.message || "Failed to save make.",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    } finally {
      setSavingMake(false);
    }
  }


  // async function deleteMake(make) {
  //   const confirmed = window.confirm(
  //     `Permanently delete make "${make.make_name}"? This cannot be undone.`
  //   );
  //   if (!confirmed) return;

  //   try {
  //     await apiRequest(`/procurement/makes/${make.id}`, {
  //       method: "DELETE",
  //     });
  //     showSuccess("Make permanently deleted.");
  //     await loadMasterData();
  //   } catch (err) {
  //     toast.error(
  //       err.message || "Unable to delete make. It may be referenced by a project BOM or material.",
  //       { position: "top-right", autoClose: 4500 }
  //     );
  //   }
  // }

  function deleteMake(make) {
    setPendingDelete({
      type: "make",
      id: make.id,
      name: make.make_name,
      title: "Delete Make",
      message:
        "This make will be permanently deleted. This action cannot be undone.",
    });
  }

  async function toggleMakeStatus(make) {
    try {
      await apiRequest(
        `/procurement/makes/${make.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            make_name: make.make_name,
            status:
              make.status === "active"
                ? "inactive"
                : "active",
          }),
        }
      );

      showSuccess(
        make.status === "active"
          ? "Make deactivated."
          : "Make activated."
      );

      await loadMasterData();
    } catch (err) {
      setError(err.message || "Failed to update make.");
    }
  }


  /* =========================================================
     MATERIAL
     ========================================================= */

  function openAddMaterial() {
    setEditingMaterial(null);

    setMaterialForm({
      material_name: "",
      current_cost: "",
      default_make_id: "",
      preferred_vendor_id: "",
    });

    setShowMaterialModal(true);
  }


  function openEditMaterial(material) {
    setEditingMaterial(material);

    setMaterialForm({
      material_name: material.material_name || "",
      current_cost: material.current_cost ?? "",
      default_make_id: material.default_make_id
        ? String(material.default_make_id)
        : "",
      preferred_vendor_id: material.preferred_vendor_id
        ? String(material.preferred_vendor_id)
        : "",
    });

    setShowMaterialModal(true);
  }


  async function saveMaterial(event) {
    event.preventDefault();

    if (!materialForm.material_name.trim()) {
      toast.error("Material name is required.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (savingMaterial) {
      return;
    }

    try {
      setSavingMaterial(true);
      setError("");

      if (editingMaterial) {
        await apiRequest(
          `/procurement/materials/${editingMaterial.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              material_name:
                materialForm.material_name.trim(),
              current_cost: Number(materialForm.current_cost) || 0,
              default_make_id: materialForm.default_make_id
                ? Number(materialForm.default_make_id)
                : null,
              preferred_vendor_id: materialForm.preferred_vendor_id
                ? Number(materialForm.preferred_vendor_id)
                : null,
              status: editingMaterial.status,
            }),
          }
        );

        showSuccess("Material updated successfully.");
      } else {
        await apiRequest("/procurement/materials", {
          method: "POST",
          body: JSON.stringify({
            material_name:
              materialForm.material_name.trim(),
            current_cost: Number(materialForm.current_cost) || 0,
            default_make_id: materialForm.default_make_id
              ? Number(materialForm.default_make_id)
              : null,
            preferred_vendor_id: materialForm.preferred_vendor_id
              ? Number(materialForm.preferred_vendor_id)
              : null,
          }),
        });

        showSuccess("Material added successfully.");
      }

      setShowMaterialModal(false);

      await loadMasterData();
    } catch (err) {
      toast.error(
        err.message || "Failed to save material.",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    } finally {
      setSavingMaterial(false);
    }
  }


  // async function deleteMaterial(material) {
  //   const confirmed = window.confirm(
  //     `Permanently delete material "${material.material_name}"? This cannot be undone.`
  //   );
  //   if (!confirmed) return;

  //   try {
  //     await apiRequest(`/procurement/materials/${material.id}`, {
  //       method: "DELETE",
  //     });
  //     showSuccess("Material permanently deleted.");
  //     await loadMasterData();
  //   } catch (err) {
  //     toast.error(
  //       err.message || "Unable to delete material. It may already be used in a project BOM.",
  //       { position: "top-right", autoClose: 4500 }
  //     );
  //   }
  // }

  function deleteMaterial(material) {
    setPendingDelete({
      type: "material",
      id: material.id,
      name: material.material_name,
      title: "Delete Material",
      message:
        "This material will be permanently deleted. This action cannot be undone.",
    });
  }

  async function toggleMaterialStatus(material) {
    try {
      await apiRequest(
        `/procurement/materials/${material.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            material_name:
              material.material_name,
            current_cost: Number(material.current_cost) || 0,
            status:
              material.status === "active"
                ? "inactive"
                : "active",
          }),
        }
      );

      showSuccess(
        material.status === "active"
          ? "Material deactivated."
          : "Material activated."
      );

      await loadMasterData();
    } catch (err) {
      setError(
        err.message ||
        "Failed to update material."
      );
    }
  }


  /* =========================================================
     BOM
     ========================================================= */

  /* =========================================================
     PROCUREMENT PROJECT
     ========================================================= */

  function openAddProject() {
    setProjectForm({
      project_name: "",
      description: "",
    });

    setError("");
    setShowProjectModal(true);
  }


  async function saveProject(event) {
    event.preventDefault();

    const projectName =
      projectForm.project_name.trim();

    if (!projectName) {
      toast.error("Project name is required.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (savingProject) {
      return;
    }

    try {
      setSavingProject(true);
      setError("");

      const data = await apiRequest(
        "/procurement/projects",
        {
          method: "POST",
          body: JSON.stringify({
            project_name: projectName,
            description:
              projectForm.description.trim() || null,
          }),
        }
      );

      const newProject =
        data?.data ||
        data?.project ||
        data;

      setProjects((current) => [
        ...current,
        newProject,
      ]);

      setSelectedProject(
        String(newProject.id)
      );

      setProjectMaterials([]);

      setShowProjectModal(false);

      setActiveTab("bom");

      showSuccess(
        `${newProject?.project_code || "Project"} created successfully.`
      );

    } catch (err) {
      console.error(
        "Create procurement project error:",
        err
      );

      toast.error(
        err.message ||
        "Failed to create procurement project.",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    } finally {
      setSavingProject(false);
    }
  }

  function openAddBomItem() {
    if (!selectedProject) {
      toast.error("Please select a project first.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setEditingBomItem(null);

    setBomForm({
      ...emptyBomForm,
    });

    setBomMaterialSearch("");
    setBomMakeSearch("");
    setBomVendorSearch("");

    setShowBomModal(true);
  }


  function openEditBomItem(item) {
    setEditingBomItem(item);

    setBomForm({
      material_id:
        item.material_id?.toString() || "",
      make_id:
        item.make_id?.toString() || "",
      vendor_id:
        item.vendor_id?.toString() || "",
      quantity: item.quantity ?? 1,
      unit: item.unit || "Nos",
      unit_cost: item.unit_cost ?? "",
      remarks: item.remarks || "",
    });

    setBomMaterialSearch(
      item.material_name || ""
    );

    setBomMakeSearch(
      item.make_name || ""
    );

    setBomVendorSearch(
      item.vendor_name || ""
    );

    setShowBomModal(true);
  }


  async function saveBomItem(event) {
    event.preventDefault();

    if (!selectedProject) {
      toast.error("Please select a project first.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!bomForm.material_id) {
      toast.error("Please select a material.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (
      bomForm.quantity === "" ||
      Number(bomForm.quantity) < 0
    ) {
      toast.error("Please enter a valid quantity.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (savingBomItem) {
      return;
    }

    try {
      setSavingBomItem(true);
      setError("");

      const payload = {
        material_id: Number(
          bomForm.material_id
        ),
        make_id: bomForm.make_id
          ? Number(bomForm.make_id)
          : null,
        vendor_id: bomForm.vendor_id
          ? Number(bomForm.vendor_id)
          : null,
        quantity: Number(
          bomForm.quantity
        ),
        unit:
          bomForm.unit?.trim() || "Nos",
        unit_cost:
          bomForm.unit_cost === "" || bomForm.unit_cost === null
            ? null
            : Number(bomForm.unit_cost),
        remarks:
          bomForm.remarks?.trim() || null,
      };

      if (editingBomItem) {
        await apiRequest(
          `/procurement/project-materials/${editingBomItem.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        showSuccess(
          "Material updated successfully."
        );
      } else {
        await apiRequest(
          `/procurement/projects/${selectedProject}/materials`,
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        showSuccess(
          "Material added to project."
        );
      }

      setShowBomModal(false);

      await loadProjectMaterials(
        selectedProject
      );
    } catch (err) {
      toast.error(
        err.message ||
        "Failed to save project material.",
        {
          position: "top-right",
          autoClose: 4000,
        }
      );
    } finally {
      setSavingBomItem(false);
    }
  }


  // async function deleteBomItem(item) {
  //   const confirmed = window.confirm(
  //     `Remove "${item.material_name}" from this project?`
  //   );

  //   if (!confirmed) {
  //     return;
  //   }

  //   try {
  //     await apiRequest(
  //       `/procurement/project-materials/${item.id}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );

  //     showSuccess(
  //       "Material removed from project."
  //     );

  //     await loadProjectMaterials(
  //       selectedProject
  //     );
  //   } catch (err) {
  //     setError(
  //       err.message ||
  //       "Failed to remove material."
  //     );
  //   }
  // }

  function deleteBomItem(item) {
    setPendingDelete({
      type: "bom",
      id: item.id,
      name: item.material_name,
      title: "Remove BOM Material",
      message:
        "This material will be removed from this project's BOM. The master material will not be deleted.",
    });
  }


  // delete code 


  async function confirmDelete() {
    if (!pendingDelete || deletingRecord) return;

    const record = pendingDelete;

    let endpoint = "";
    let successMessage = "";

    switch (record.type) {
      case "vendor":
        endpoint = `/procurement/vendors/${record.id}`;
        successMessage = "Vendor permanently deleted.";
        break;

      case "make":
        endpoint = `/procurement/makes/${record.id}`;
        successMessage = "Make permanently deleted.";
        break;

      case "material":
        endpoint = `/procurement/materials/${record.id}`;
        successMessage = "Material permanently deleted.";
        break;

      case "bom":
        endpoint = `/procurement/project-materials/${record.id}`;
        successMessage = "Material removed from project BOM.";
        break;

      default:
        return;
    }

    try {
      setDeletingRecord(true);

      await apiRequest(endpoint, {
        method: "DELETE",
      });

      setPendingDelete(null);
      showSuccess(successMessage);

      if (record.type === "bom") {
        await loadProjectMaterials(selectedProject);
      } else {
        await loadMasterData();
      }
    } catch (err) {
      toast.error(
        err.message || "Unable to complete the delete operation.",
        {
          position: "top-right",
          autoClose: 4500,
        }
      );
    } finally {
      setDeletingRecord(false);
    }
  }

  /* =========================================================
     SEARCHED LISTS
     ========================================================= */

  const filteredVendors = useMemo(() => {
    const query =
      vendorSearch.trim().toLowerCase();

    const byStatus = vendors.filter((vendor) =>
      recordStatusView === "active"
        ? vendor.status === "active"
        : vendor.status !== "active"
    );

    if (!query) return byStatus;

    return byStatus.filter((vendor) =>
      vendor.vendor_name?.toLowerCase().includes(query)
    );
  }, [vendors, vendorSearch, recordStatusView]);


  const filteredMakes = useMemo(() => {
    const query =
      makeSearch.trim().toLowerCase();

    const byStatus = makes.filter((make) =>
      recordStatusView === "active"
        ? make.status === "active"
        : make.status !== "active"
    );

    if (!query) return byStatus;

    return byStatus.filter((make) =>
      make.make_name?.toLowerCase().includes(query)
    );
  }, [makes, makeSearch, recordStatusView]);


  const filteredMaterials = useMemo(() => {
    const query =
      materialSearch.trim().toLowerCase();

    const byStatus = materials.filter((material) =>
      recordStatusView === "active"
        ? material.status === "active"
        : material.status !== "active"
    );

    if (!query) return byStatus;

    return byStatus.filter((material) =>
      material.material_name?.toLowerCase().includes(query)
    );
  }, [materials, materialSearch, recordStatusView]);


  const filteredBomMaterials =
    useMemo(() => {
      const query =
        bomMaterialSearch
          .trim()
          .toLowerCase();

      const activeMaterials = materials.filter(
        (material) => material.status === "active"
      );

      if (!query) return activeMaterials.slice(0, 10);

      return activeMaterials
        .filter((material) =>
          material.material_name?.toLowerCase().includes(query)
        )
        .slice(0, 10);
    }, [
      materials,
      bomMaterialSearch,
    ]);


  const filteredBomMakes = useMemo(() => {
    const query =
      bomMakeSearch.trim().toLowerCase();

    const activeMakes = makes.filter(
      (make) => make.status === "active"
    );

    if (!query) return activeMakes.slice(0, 10);

    return activeMakes
      .filter((make) =>
        make.make_name?.toLowerCase().includes(query)
      )
      .slice(0, 10);
  }, [makes, bomMakeSearch]);


  const filteredBomVendors =
    useMemo(() => {
      const query =
        bomVendorSearch
          .trim()
          .toLowerCase();

      const activeVendors = vendors.filter(
        (vendor) => vendor.status === "active"
      );

      if (!query) return activeVendors.slice(0, 10);

      return activeVendors
        .filter((vendor) =>
          vendor.vendor_name?.toLowerCase().includes(query)
        )
        .slice(0, 10);
    }, [
      vendors,
      bomVendorSearch,
    ]);


  /* =========================================================
     PROJECT NAME
     ========================================================= */

  const selectedProjectObject =
    projects.find(
      (project) =>
        String(project.id) ===
        String(selectedProject)
    );

  // Print-only procurement document: grouped first by vendor, then by make.
  // const printableGroups = useMemo(() => {
  //   const groups = new Map();

  //   projectMaterials.forEach((item) => {
  //     const vendorName = (item.vendor_name || "Vendor Not Assigned").trim();
  //     const makeName = (item.make_name || "Make Not Assigned").trim();
  //     const key = `${vendorName.toLowerCase()}|||${makeName.toLowerCase()}`;

  //     if (!groups.has(key)) {
  //       groups.set(key, {
  //         vendorName,
  //         makeName,
  //         items: [],
  //       });
  //     }

  //     groups.get(key).items.push(item);
  //   });

  //   return Array.from(groups.values())
  //     .map((group) => ({
  //       ...group,
  //       items: [...group.items].sort((a, b) =>
  //         String(a.material_name || "").localeCompare(String(b.material_name || ""))
  //       ),
  //     }))
  //     .sort((a, b) => {
  //       const vendorComparison = a.vendorName.localeCompare(b.vendorName);
  //       return vendorComparison || a.makeName.localeCompare(b.makeName);
  //     });
  // }, [projectMaterials]);



  // Print-only procurement document: preserve insertion order
  // within each vendor and make group.
  const printableGroups = useMemo(() => {
    const groups = new Map();

    projectMaterials.forEach((item) => {
      const vendorName = (
        item.vendor_name || "Vendor Not Assigned"
      ).trim();

      const makeName = (
        item.make_name || "Make Not Assigned"
      ).trim();

      const key = `${vendorName.toLowerCase()}|||${makeName.toLowerCase()}`;

      if (!groups.has(key)) {
        groups.set(key, {
          vendorName,
          makeName,
          items: [],
        });
      }

      // Push items in the exact order received from the BOM.
      // Do not sort by material name.
      groups.get(key).items.push(item);
    });

    // Preserve the order in which each vendor/make group
    // first appeared in the BOM.
    return Array.from(groups.values());
  }, [projectMaterials]);


  function printProcurementList() {
    if (!selectedProject || projectMaterials.length === 0) {
      toast.info("Select a project with materials before printing.");
      return;
    }

    window.print();
  }


  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="procurement-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="procurement-header">

        <div>
          <h1>Procurement</h1>

          <p>
            Manage vendors, makes, materials
            and project BOMs.
          </p>
        </div>

      </div>


      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      {error && (
        <div className="procurement-alert error">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="procurement-tabs">

        <button
          className={
            activeTab === "overview"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("overview")
          }
        >
          Overview
        </button>

        <button
          className={
            activeTab === "bom"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("bom")
          }
        >
          Project BOM
        </button>

        <button
          className={
            activeTab === "vendors"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("vendors")
          }
        >
          Vendors
        </button>

        <button
          className={
            activeTab === "makes"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("makes")
          }
        >
          Makes
        </button>

        <button
          className={
            activeTab === "materials"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("materials")
          }
        >
          Materials
        </button>

      </div>


      {/* =====================================================
          OVERVIEW
      ===================================================== */}

      {activeTab === "overview" && (
        <section className="procurement-content">

          <div className="procurement-stat-grid">

            <button
              className="procurement-stat-card"
              onClick={() =>
                setActiveTab("vendors")
              }
            >
              <span>Vendors</span>
              <strong>
                {loading
                  ? "—"
                  : vendors.length}
              </strong>

              <small>
                Manage suppliers
              </small>
            </button>


            <button
              className="procurement-stat-card"
              onClick={() =>
                setActiveTab("makes")
              }
            >
              <span>Makes</span>
              <strong>
                {loading
                  ? "—"
                  : makes.length}
              </strong>

              <small>
                Manage manufacturers
              </small>
            </button>


            <button
              className="procurement-stat-card"
              onClick={() =>
                setActiveTab("materials")
              }
            >
              <span>Materials</span>
              <strong>
                {loading
                  ? "—"
                  : materials.length}
              </strong>

              <small>
                Reusable material catalogue
              </small>
            </button>


            <button
              className="procurement-stat-card"
              onClick={() =>
                setActiveTab("bom")
              }
            >
              <span>Procurement Projects</span>
              <strong>
                {projects.length}
              </strong>

              <small>
                Available for BOM
              </small>
            </button>

          </div>


          <div className="procurement-info-card">

            <div>
              <h2>
                How Procurement works
              </h2>

              <p>
                Create reusable materials,
                makes and vendors once.
                Then select them while
                preparing the BOM for any
                project.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                setActiveTab("bom")
              }
            >
              Open Project BOM
            </button>

          </div>

        </section>
      )}


      {/* =====================================================
          VENDORS
      ===================================================== */}

      {activeTab === "vendors" && (
        <section className="procurement-content">

          <div className="section-heading">

            <div>
              <h2>Vendors</h2>

              <p>
                Manage reusable vendor names.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={openAddVendor}
            >
              + Add Vendor
            </button>

          </div>


          <div className="table-toolbar">

            <input
              type="search"
              placeholder="Search vendors..."
              value={vendorSearch}
              onChange={(event) =>
                setVendorSearch(
                  event.target.value
                )
              }
            />

            <div className="row-actions" role="group" aria-label="Vendor status filter">
              <button type="button" className={recordStatusView === "active" ? "primary-button" : "secondary-button"} onClick={() => setRecordStatusView("active")}>Active</button>
              <button type="button" className={recordStatusView === "disabled" ? "primary-button" : "secondary-button"} onClick={() => setRecordStatusView("disabled")}>Disabled</button>
            </div>

          </div>


          <div className="data-table-card">

            {vendorLoading ? (
              <div className="empty-state">
                Loading vendors...
              </div>
            ) : filteredVendors.length === 0 ? (
              <div className="empty-state">

                <strong>
                  {recordStatusView === "active" ? "No active vendors found" : "No disabled vendors found"}
                </strong>

                <span>
                  {recordStatusView === "active" ? "Add your first vendor." : "Disabled vendors will appear here."}
                </span>

              </div>
            ) : (
              <div className="table-scroll">

                <table>

                  <thead>
                    <tr>
                      <th>Vendor Name</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredVendors.map(
                      (vendor) => (
                        <tr key={vendor.id}>

                          <td>
                            <strong>
                              {
                                vendor.vendor_name
                              }
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`status-badge ${vendor.status
                                }`}
                            >
                              {vendor.status}
                            </span>
                          </td>

                          <td>
                            <div className="row-actions">

                              <button
                                className="secondary-button"
                                onClick={() =>
                                  openEditVendor(
                                    vendor
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="text-button"
                                onClick={() => toggleVendorStatus(vendor)}
                              >
                                {vendor.status === "active" ? "Disable" : "Enable"}
                              </button>

                              <button
                                className="danger-button"
                                onClick={() => deleteVendor(vendor)}
                              >
                                Delete
                              </button>

                            </div>
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>
      )}


      {/* =====================================================
          MAKES
      ===================================================== */}

      {activeTab === "makes" && (
        <section className="procurement-content">

          <div className="section-heading">

            <div>
              <h2>Makes</h2>

              <p>
                Manage manufacturers and brands.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={openAddMake}
            >
              + Add Make
            </button>

          </div>


          <div className="table-toolbar">

            <input
              type="search"
              placeholder="Search makes..."
              value={makeSearch}
              onChange={(event) =>
                setMakeSearch(
                  event.target.value
                )
              }
            />

            <div className="row-actions" role="group" aria-label="Make status filter">
              <button type="button" className={recordStatusView === "active" ? "primary-button" : "secondary-button"} onClick={() => setRecordStatusView("active")}>Active</button>
              <button type="button" className={recordStatusView === "disabled" ? "primary-button" : "secondary-button"} onClick={() => setRecordStatusView("disabled")}>Disabled</button>
            </div>

          </div>


          <div className="data-table-card">

            {makeLoading ? (
              <div className="empty-state">
                Loading makes...
              </div>
            ) : filteredMakes.length === 0 ? (
              <div className="empty-state">

                <strong>
                  {recordStatusView === "active" ? "No active makes found" : "No disabled makes found"}
                </strong>

                <span>
                  {recordStatusView === "active" ? "Add your first make." : "Disabled makes will appear here."}
                </span>

              </div>
            ) : (
              <div className="table-scroll">

                <table>

                  <thead>
                    <tr>
                      <th>Make</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredMakes.map(
                      (make) => (
                        <tr key={make.id}>

                          <td>
                            <strong>
                              {make.make_name}
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`status-badge ${make.status
                                }`}
                            >
                              {make.status}
                            </span>
                          </td>

                          <td>
                            <div className="row-actions">

                              <button
                                className="secondary-button"
                                onClick={() =>
                                  openEditMake(
                                    make
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="text-button"
                                onClick={() => toggleMakeStatus(make)}
                              >
                                {make.status === "active" ? "Disable" : "Enable"}
                              </button>

                              <button
                                className="danger-button"
                                onClick={() => deleteMake(make)}
                              >
                                Delete
                              </button>

                            </div>
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>
      )}


      {/* =====================================================
          MATERIALS
      ===================================================== */}

      {activeTab === "materials" && (
        <section className="procurement-content">

          <div className="section-heading">

            <div>
              <h2>Materials</h2>

              <p>
                Build your reusable material catalogue.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={openAddMaterial}
            >
              + Add Material
            </button>

          </div>


          <div className="table-toolbar">

            <input
              type="search"
              placeholder="Search materials..."
              value={materialSearch}
              onChange={(event) =>
                setMaterialSearch(
                  event.target.value
                )
              }
            />

            <div className="row-actions" role="group" aria-label="Material status filter">
              <button type="button" className={recordStatusView === "active" ? "primary-button" : "secondary-button"} onClick={() => setRecordStatusView("active")}>Active</button>
              <button type="button" className={recordStatusView === "disabled" ? "primary-button" : "secondary-button"} onClick={() => setRecordStatusView("disabled")}>Disabled</button>
            </div>

          </div>


          <div className="data-table-card">

            {materialLoading ? (
              <div className="empty-state">
                Loading materials...
              </div>
            ) : filteredMaterials.length === 0 ? (
              <div className="empty-state">

                <strong>
                  {recordStatusView === "active" ? "No active materials found" : "No disabled materials found"}
                </strong>

                <span>
                  {recordStatusView === "active" ? "Add your first material." : "Disabled materials will appear here."}
                </span>

              </div>
            ) : (
              <div className="table-scroll">

                <table>

                  <thead>
                    <tr>
                      <th>Material</th>
                      <th>Cost</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredMaterials.map(
                      (material) => (
                        <tr
                          key={material.id}
                        >

                          <td>
                            <strong>
                              {
                                material.material_name
                              }
                            </strong>
                          </td>

                          <td>
                            ₹{Number(material.current_cost || 0).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>

                          <td>
                            <span
                              className={`status-badge ${material.status
                                }`}
                            >
                              {material.status}
                            </span>
                          </td>

                          <td>
                            <div className="row-actions">

                              <button
                                className="secondary-button"
                                onClick={() =>
                                  openEditMaterial(
                                    material
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="text-button"
                                onClick={() => toggleMaterialStatus(material)}
                              >
                                {material.status === "active" ? "Disable" : "Enable"}
                              </button>

                              <button
                                className="danger-button"
                                onClick={() => deleteMaterial(material)}
                              >
                                Delete
                              </button>

                            </div>
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </section>
      )}


      {/* =====================================================
          PROJECT BOM
      ===================================================== */}

      {activeTab === "bom" && (
        <section className="procurement-content">

          <div className="section-heading">
            <div>
              <h2>Project BOM</h2>

              <p>
                Create procurement projects and manage their BOMs.
              </p>
            </div>

            <button
              className="primary-button"
              type="button"
              onClick={openAddProject}
            >
              + New Project
            </button>
          </div>


          {/* <div className="project-selector-card">

            <label>
              Select Project
            </label>

            <select
              value={selectedProject}
              onChange={handleProjectChange}
            >
              <option value="">
                Select a project...
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.project_name ||
                    project.name ||
                    `Project #${project.id}`}
                </option>
              ))}

            </select>

          </div> */}


          <div className="project-selector-card">
            <label>
              Select Procurement Project
            </label>

            <select
              value={selectedProject}
              onChange={handleProjectChange}
            >
              <option value="">
                Select a procurement project...
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.project_code
                    ? `${project.project_code} — ${project.project_name}`
                    : project.project_name ||
                    `Project #${project.id}`}
                </option>
              ))}
            </select>
          </div>

          {selectedProject && (
            <div className="bom-card">

              <div className="bom-header">

                <div>
                  {/* <h3>
                    {
                      selectedProjectObject
                        ?.project_name ||
                      selectedProjectObject
                        ?.name ||
                      "Selected Project"
                    }
                  </h3> */}


                  <h3>
                    {selectedProjectObject?.project_code
                      ? `${selectedProjectObject.project_code} — ${selectedProjectObject.project_name}`
                      : selectedProjectObject?.project_name ||
                      selectedProjectObject?.name ||
                      "Selected Project"}
                  </h3>

                  <span>
                    {projectMaterials.length}{" "}
                    material
                    {projectMaterials.length ===
                      1
                      ? ""
                      : "s"}
                  </span>
                </div>

                <div className="bom-header-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={printProcurementList}
                    disabled={projectLoading || projectMaterials.length === 0}
                    title="Print materials grouped by vendor and make"
                  >
                    Print Procurement List
                  </button>

                  <button
                    type="button"
                    className="primary-button"
                    onClick={openAddBomItem}
                  >
                    + Add Material
                  </button>
                </div>

              </div>


              {projectLoading ? (
                <div className="empty-state">
                  Loading project BOM...
                </div>
              ) : projectMaterials.length ===
                0 ? (
                <div className="empty-state bom-empty">

                  <div className="empty-icon">
                    +
                  </div>

                  <strong>
                    No materials added yet
                  </strong>

                  <span>
                    Start building the BOM for this
                    project.
                  </span>

                  <button
                    className="primary-button"
                    onClick={openAddBomItem}
                  >
                    Add First Material
                  </button>

                </div>
              ) : (
                <div className="table-scroll">

                  <table>

                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Material</th>
                        <th>Make</th>
                        <th>Vendor</th>
                        <th>Qty</th>
                        <th>Unit</th>
                        <th>Unit Cost</th>
                        <th>Remarks</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>

                      {projectMaterials.map(
                        (item, index) => (
                          <tr key={item.id}>

                            <td>
                              {index + 1}
                            </td>

                            <td>
                              <strong>
                                {
                                  item.material_name
                                }
                              </strong>
                            </td>

                            <td>
                              {item.make_name ||
                                "—"}
                            </td>

                            <td>
                              {item.vendor_name ||
                                "—"}
                            </td>

                            <td>
                              {item.quantity}
                            </td>

                            <td>
                              {item.unit || "Nos"}
                            </td>

                            <td>
                              ₹{Number(item.unit_cost || 0).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>

                            <td className="remarks-cell">
                              {item.remarks ||
                                "—"}
                            </td>

                            <td>
                              <div className="row-actions">

                                <button
                                  className="secondary-button"
                                  onClick={() =>
                                    openEditBomItem(
                                      item
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="danger-button"
                                  onClick={() =>
                                    deleteBomItem(
                                      item
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>
                            </td>

                          </tr>
                        )
                      )}

                    </tbody>

                  </table>

                </div>
              )}

            </div>
          )}

        </section>
      )}


      {/* =====================================================
          PRINT-ONLY PROCUREMENT DOCUMENT
      ===================================================== */}
      {selectedProject && projectMaterials.length > 0 && (
        <div className="procurement-print-document" aria-hidden="true">


          <header className="print-company-header">
            <div className="print-brand-row">
              <img
                className="print-company-logo"
                src={cesLogo}
                alt="Circuits Energy System logo"
                onError={(event) => { event.currentTarget.style.display = "none"; }}
              />
              {/* <div className="print-brand-copy">
                <p className="print-company-name">CIRCUITS ENERGY SYSTEM</p>
                <p className="print-company-subtitle">Industrial Automation · Electrical Control Panels</p>
              </div> */}
              <div className="print-document-chip">PROCUREMENT<br />MATERIAL LIST</div>
            </div>
            <div className="print-header-accent" />
          </header>

          <div className="print-project-block">
            <p className="print-project-name">
              Project: {selectedProjectObject?.project_name || selectedProjectObject?.name || "Procurement Project"}
            </p>
            <p className="print-project-meta">
              {selectedProjectObject?.project_code ? `Project Code: ${selectedProjectObject.project_code}  |  ` : ""}
              Printed on: {new Date().toLocaleDateString("en-IN")}
            </p>
          </div>

          {printableGroups.map((group) => (
            <section
              className="print-vendor-group"
              key={`${group.vendorName}|||${group.makeName}`}
            >
              <h2 className="print-vendor-heading">
                {group.vendorName} - {group.makeName}
              </h2>
              <table className="print-material-table">
                <thead>
                  <tr>
                    <th className="print-number">S.No.</th>
                    <th className="print-product">Product / Material</th>
                    <th className="print-qty">Quantity</th>
                    <th className="print-unit">Unit</th>
                    <th className="print-price">Unit Price (INR)</th>
                    <th className="print-empty">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item, index) => (
                    <tr key={item.id || `${item.material_name}-${index}`}>
                      <td className="print-number">{index + 1}</td>
                      <td className="print-product">{item.material_name || "—"}</td>
                      <td className="print-qty">{item.quantity ?? "—"}</td>
                      <td className="print-unit">{item.unit || "Nos"}</td>
                      <td className="print-price">₹{Number(item.unit_cost || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="print-empty">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      )}


      {/* =====================================================
          VENDOR MODAL
      ===================================================== */}


      {/* =====================================================
    PROCUREMENT PROJECT MODAL
===================================================== */}

      {showProjectModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget &&
              !savingProject
            ) {
              setShowProjectModal(false);
            }
          }}
        >
          <form
            className="modal-card"
            onSubmit={saveProject}
          >
            <div className="modal-header">
              <div>
                <h3>
                  New Procurement Project
                </h3>

                <p>
                  Create a project exclusively for Procurement.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  !savingProject &&
                  setShowProjectModal(false)
                }
                disabled={savingProject}
              >
                ×
              </button>
            </div>

            <div className="form-field">
              <label>
                Project Name
              </label>

              <input
                type="text"
                placeholder="Enter project name"
                value={projectForm.project_name}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    project_name:
                      event.target.value,
                  }))
                }
                autoFocus
              />
            </div>

            <div className="form-field">
              <label>
                Description
                <span className="optional-label">
                  Optional
                </span>
              </label>

              <textarea
                rows="4"
                placeholder="Enter project description"
                value={projectForm.description}
                onChange={(event) =>
                  setProjectForm((current) => ({
                    ...current,
                    description:
                      event.target.value,
                  }))
                }
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  !savingProject &&
                  setShowProjectModal(false)
                }
                disabled={savingProject}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={savingProject}
              >
                {savingProject
                  ? "Creating..."
                  : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {showVendorModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget &&
              !savingVendor
            ) {
              setShowVendorModal(false);
            }
          }}
        >

          <form
            className="modal-card"
            onSubmit={saveVendor}
          >

            <div className="modal-header">

              <div>
                <h3>
                  {editingVendor
                    ? "Edit Vendor"
                    : "Add Vendor"}
                </h3>

                <p>
                  Vendor names are reusable across projects.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  !savingVendor &&
                  setShowVendorModal(false)
                }
                disabled={savingVendor}
              >
                ×
              </button>

            </div>


            <div className="form-field">

              <label>
                Vendor Name
              </label>

              <input
                autoFocus
                value={
                  vendorForm.vendor_name
                }
                onChange={(event) =>
                  setVendorForm({
                    vendor_name:
                      event.target.value,
                  })
                }
                placeholder="e.g. Addon Electrical"
              />

            </div>


            <div className="modal-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  !savingVendor &&
                  setShowVendorModal(false)
                }
                disabled={savingVendor}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={savingVendor}
              >
                {savingVendor
                  ? "Saving..."
                  : editingVendor
                    ? "Save Changes"
                    : "Add Vendor"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* =====================================================
          MAKE MODAL
      ===================================================== */}

      {showMakeModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget &&
              !savingMake
            ) {
              setShowMakeModal(false);
            }
          }}
        >

          <form
            className="modal-card"
            onSubmit={saveMake}
          >

            <div className="modal-header">

              <div>
                <h3>
                  {editingMake
                    ? "Edit Make"
                    : "Add Make"}
                </h3>

                <p>
                  Manufacturers are reusable across projects.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  !savingMake &&
                  setShowMakeModal(false)
                }
                disabled={savingMake}
              >
                ×
              </button>

            </div>


            <div className="form-field">

              <label>
                Make / Manufacturer
              </label>

              <input
                autoFocus
                value={
                  makeForm.make_name
                }
                onChange={(event) =>
                  setMakeForm({
                    make_name:
                      event.target.value,
                  })
                }
                placeholder="e.g. L&T"
              />

            </div>


            <div className="modal-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  !savingMake &&
                  setShowMakeModal(false)
                }
                disabled={savingMake}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={savingMake}
              >
                {savingMake
                  ? "Saving..."
                  : editingMake
                    ? "Save Changes"
                    : "Add Make"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* =====================================================
          MATERIAL MODAL
      ===================================================== */}

      {showMaterialModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget &&
              !savingMaterial
            ) {
              setShowMaterialModal(false);
            }
          }}
        >

          <form
            className="modal-card"
            onSubmit={saveMaterial}
          >

            <div className="modal-header">

              <div>
                <h3>
                  {editingMaterial
                    ? "Edit Material"
                    : "Add Material"}
                </h3>

                <p>
                  Materials become available for future project BOMs.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  !savingMaterial &&
                  setShowMaterialModal(false)
                }
                disabled={savingMaterial}
              >
                ×
              </button>

            </div>


            <div className="form-field">

              <label>
                Material Name
              </label>

              <input
                autoFocus
                value={
                  materialForm.material_name
                }
                onChange={(event) =>
                  setMaterialForm((current) => ({
                    ...current,
                    material_name: event.target.value,
                  }))
                }
                placeholder="e.g. 37 kW Line Choke"
              />

            </div>


            <div className="form-field">

              <label>
                Default Make
                <span className="optional-label">Optional</span>
              </label>

              <select
                value={materialForm.default_make_id}
                onChange={(event) =>
                  setMaterialForm((current) => ({
                    ...current,
                    default_make_id: event.target.value,
                  }))
                }
              >
                <option value="">No default make</option>
                {makes
                  .filter((make) => make.status === "active")
                  .map((make) => (
                    <option key={make.id} value={String(make.id)}>
                      {make.make_name}
                    </option>
                  ))}
              </select>

            </div>


            <div className="form-field">

              <label>
                Preferred Vendor
                <span className="optional-label">Optional</span>
              </label>

              <select
                value={materialForm.preferred_vendor_id}
                onChange={(event) =>
                  setMaterialForm((current) => ({
                    ...current,
                    preferred_vendor_id: event.target.value,
                  }))
                }
              >
                <option value="">No preferred vendor</option>
                {vendors
                  .filter((vendor) => vendor.status === "active")
                  .map((vendor) => (
                    <option key={vendor.id} value={String(vendor.id)}>
                      {vendor.vendor_name}
                    </option>
                  ))}
              </select>

            </div>


            <div className="form-field">

              <label>
                Current Cost
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={materialForm.current_cost}
                onChange={(event) =>
                  setMaterialForm((current) => ({
                    ...current,
                    current_cost: event.target.value,
                  }))
                }
                placeholder="e.g. 2500"
              />

            </div>


            <div className="modal-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  !savingMaterial &&
                  setShowMaterialModal(false)
                }
                disabled={savingMaterial}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={savingMaterial}
              >
                {savingMaterial
                  ? "Saving..."
                  : editingMaterial
                    ? "Save Changes"
                    : "Add Material"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* =====================================================
          BOM MODAL
      ===================================================== */}

      {showBomModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget &&
              !savingBomItem
            ) {
              setShowBomModal(false);
            }
          }}
        >

          <form
            className="modal-card bom-modal"
            onSubmit={saveBomItem}
          >

            <div className="modal-header">

              <div>
                <h3>
                  {editingBomItem
                    ? "Edit Material"
                    : "Add Material"}
                </h3>

                <p>
                  Add a reusable material to this project.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() =>
                  !savingBomItem &&
                  setShowBomModal(false)
                }
                disabled={savingBomItem}
              >
                ×
              </button>

            </div>


            {/* MATERIAL */}

            <div className="form-field">

              <label>
                Material
              </label>

              <div className="autocomplete">

                <input
                  autoFocus
                  value={
                    bomMaterialSearch
                  }
                  onChange={(event) => {
                    setBomMaterialSearch(
                      event.target.value
                    );

                    setBomForm(
                      (current) => ({
                        ...current,
                        material_id: "",
                      })
                    );
                  }}
                  placeholder="Search material..."
                />


                {bomMaterialSearch &&
                  !bomForm.material_id && (
                    <div className="autocomplete-menu">

                      {filteredBomMaterials.length >
                        0 ? (
                        filteredBomMaterials.map(
                          (material) => (
                            <button
                              type="button"
                              key={
                                material.id
                              }
                              onClick={() => {
                                const defaultMakeId =
                                  material.default_make_id
                                    ? String(material.default_make_id)
                                    : "";
                                const preferredVendorId =
                                  material.preferred_vendor_id
                                    ? String(material.preferred_vendor_id)
                                    : "";

                                setBomForm((current) => ({
                                  ...current,
                                  material_id: String(material.id),
                                  make_id: defaultMakeId,
                                  vendor_id: preferredVendorId,
                                  unit_cost:
                                    material.current_cost ?? current.unit_cost,
                                }));

                                setBomMakeSearch(
                                  material.default_make_name ||
                                  makes.find(
                                    (make) =>
                                      String(make.id) === defaultMakeId
                                  )?.make_name ||
                                  ""
                                );

                                setBomVendorSearch(
                                  material.preferred_vendor_name ||
                                  vendors.find(
                                    (vendor) =>
                                      String(vendor.id) === preferredVendorId
                                  )?.vendor_name ||
                                  ""
                                );

                                setBomMaterialSearch(material.material_name);
                              }}
                            >
                              {
                                material.material_name
                              }
                            </button>
                          )
                        )
                      ) : (
                        <div className="autocomplete-empty">
                          No matching material.
                        </div>
                      )}

                    </div>
                  )}

              </div>

              {!bomForm.material_id && (
                <small className="field-hint">
                  Select an existing material from the catalogue.
                </small>
              )}

            </div>


            {/* MAKE */}

            <div className="form-field">

              <label>
                Make
              </label>

              <div className="autocomplete">

                <input
                  value={
                    bomMakeSearch
                  }
                  onChange={(event) => {
                    setBomMakeSearch(
                      event.target.value
                    );

                    setBomForm(
                      (current) => ({
                        ...current,
                        make_id: "",
                      })
                    );
                  }}
                  placeholder="Search make..."
                />


                {bomMakeSearch &&
                  !bomForm.make_id && (
                    <div className="autocomplete-menu">

                      {filteredBomMakes.length >
                        0 ? (
                        filteredBomMakes.map(
                          (make) => (
                            <button
                              type="button"
                              key={make.id}
                              onClick={() => {
                                setBomForm(
                                  (current) => ({
                                    ...current,
                                    make_id:
                                      make.id.toString(),
                                  })
                                );

                                setBomMakeSearch(
                                  make.make_name
                                );
                              }}
                            >
                              {make.make_name}
                            </button>
                          )
                        )
                      ) : (
                        <div className="autocomplete-empty">
                          No matching make.
                        </div>
                      )}

                    </div>
                  )}

              </div>

            </div>


            {/* VENDOR */}

            <div className="form-field">

              <label>
                Vendor
              </label>

              <div className="autocomplete">

                <input
                  value={
                    bomVendorSearch
                  }
                  onChange={(event) => {
                    setBomVendorSearch(
                      event.target.value
                    );

                    setBomForm(
                      (current) => ({
                        ...current,
                        vendor_id: "",
                      })
                    );
                  }}
                  placeholder="Search vendor..."
                />


                {bomVendorSearch &&
                  !bomForm.vendor_id && (
                    <div className="autocomplete-menu">

                      {filteredBomVendors.length >
                        0 ? (
                        filteredBomVendors.map(
                          (vendor) => (
                            <button
                              type="button"
                              key={
                                vendor.id
                              }
                              onClick={() => {
                                setBomForm(
                                  (current) => ({
                                    ...current,
                                    vendor_id:
                                      vendor.id.toString(),
                                  })
                                );

                                setBomVendorSearch(
                                  vendor.vendor_name
                                );
                              }}
                            >
                              {
                                vendor.vendor_name
                              }
                            </button>
                          )
                        )
                      ) : (
                        <div className="autocomplete-empty">
                          No matching vendor.
                        </div>
                      )}

                    </div>
                  )}

              </div>

            </div>


            {/* QUANTITY + UNIT */}

            <div className="form-row">

              <div className="form-field">

                <label>
                  Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={
                    bomForm.quantity
                  }
                  onChange={(event) =>
                    setBomForm(
                      (current) => ({
                        ...current,
                        quantity:
                          event.target.value,
                      })
                    )
                  }
                />

              </div>


              <div className="form-field">

                <label>
                  Unit
                </label>

                <select
                  value={
                    bomForm.unit
                  }
                  onChange={(event) =>
                    setBomForm(
                      (current) => ({
                        ...current,
                        unit:
                          event.target.value,
                      })
                    )
                  }
                >
                  <option value="Nos">
                    Nos
                  </option>

                  <option value="Set">
                    Set
                  </option>

                  <option value="Meter">
                    Meter
                  </option>

                  <option value="Kg">
                    Kg
                  </option>

                  <option value="Box">
                    Box
                  </option>

                  <option value="Pack">
                    Pack
                  </option>

                  <option value="Lot">
                    Lot
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>


            {/* UNIT COST */}

            <div className="form-field">

              <label>
                Unit Cost
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={bomForm.unit_cost}
                onChange={(event) =>
                  setBomForm((current) => ({
                    ...current,
                    unit_cost: event.target.value,
                  }))
                }
                placeholder="e.g. 2500"
              />

            </div>


            {/* REMARKS */}

            <div className="form-field">

              <label>
                Remarks
              </label>

              <textarea
                rows="3"
                value={
                  bomForm.remarks
                }
                onChange={(event) =>
                  setBomForm(
                    (current) => ({
                      ...current,
                      remarks:
                        event.target.value,
                    })
                  )
                }
                placeholder="Optional remarks..."
              />

            </div>


            <div className="modal-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  !savingBomItem &&
                  setShowBomModal(false)
                }
                disabled={savingBomItem}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={savingBomItem}
              >
                {savingBomItem
                  ? "Saving..."
                  : editingBomItem
                    ? "Save Changes"
                    : "Add Material"}
              </button>

            </div>

          </form>

        </div>
      )}


      {pendingDelete && (
        <div
          className="ces-delete-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deletingRecord
            ) {
              setPendingDelete(null);
            }
          }}
        >
          <div
            className="ces-delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ces-delete-title"
            aria-describedby="ces-delete-description"
          >
            <div className="ces-delete-icon">
              !
            </div>

            <h2 id="ces-delete-title">
              {pendingDelete.title}
            </h2>

            <p className="ces-delete-record-name">
              {pendingDelete.name}
            </p>

            <p id="ces-delete-description">
              {pendingDelete.message}
            </p>

            <div className="ces-delete-actions">
              <button
                type="button"
                className="ces-delete-cancel"
                disabled={deletingRecord}
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ces-delete-confirm"
                disabled={deletingRecord}
                onClick={confirmDelete}
              >
                {deletingRecord ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}









